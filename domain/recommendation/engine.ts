import { BUSINESS_RULES } from "@/lib/config/business-rules";
import type { NicheFacts } from "@/domain/niche/types";
import type { NicheScores } from "@/domain/scoring/types";
import type { UserGoals } from "@/types/goals";
import type { PersonalizationMeta, PersonalizationResult, RuleAdjustment } from "./types";
import { hasPreferredCategory } from "./helpers";

function pushAdj(
  list: RuleAdjustment[],
  ruleId: string,
  label: string,
  deltaPoints: number,
): number {
  if (deltaPoints === 0) return 0;
  list.push({ ruleId, label, deltaPoints });
  return deltaPoints;
}

function fitFromPersonalizedScore(score: number): PersonalizationMeta["fitLabel"] {
  if (score >= 82) return "strong";
  if (score >= 68) return "good";
  return "cautious";
}

function riskFromFactsAndScores(facts: NicheFacts, scores: NicheScores): PersonalizationMeta["riskLabel"] {
  if (scores.competitionScore > 72 || facts.seasonalityIndex > 0.55) return "high";
  if (scores.competitionScore > 48) return "medium";
  return "low";
}

/**
 * Computes personalized rank score (0–100) from core `scores.overallScore` plus goal-aware deltas.
 * All rules are additive with explicit audit rows in `adjustments`.
 */
export function computePersonalization(
  facts: NicheFacts,
  scores: NicheScores,
  goals: UserGoals,
): PersonalizationResult {
  const rules = BUSINESS_RULES.ranking;
  const adjustments: RuleAdjustment[] = [];
  let delta = 0;

  if (hasPreferredCategory(goals, facts.category)) {
    delta += pushAdj(
      adjustments,
      "preferred_category",
      "Совпадение с предпочтительной категорией",
      rules.preferredCategoryBoost,
    );
  }

  if (goals.experienceLevel === "beginner") {
    const comp =
      (scores.competitionScore / 100) * rules.beginnerCompetitionPenalty;
    delta += pushAdj(
      adjustments,
      "beginner_competition",
      "Новичок — штраф за высокую конкуренцию",
      -comp,
    );
    const compx =
      (facts.operationalComplexity / 5) * rules.beginnerComplexityPenalty;
    delta += pushAdj(
      adjustments,
      "beginner_complexity",
      "Новичок — штраф за операционную сложность",
      -compx,
    );
  }

  if (goals.experienceLevel === "intermediate") {
    const comp =
      (scores.competitionScore / 100) *
      rules.beginnerCompetitionPenalty *
      rules.intermediateCompetitionFactor;
    delta += pushAdj(
      adjustments,
      "intermediate_competition",
      "Средний уровень — осторожность по конкуренции",
      -comp,
    );
    const compx =
      (facts.operationalComplexity / 5) *
      rules.beginnerComplexityPenalty *
      rules.intermediateComplexityFactor;
    delta += pushAdj(
      adjustments,
      "intermediate_complexity",
      "Средний уровень — осторожность по сложности",
      -compx,
    );
  }

  if (goals.availableBudgetRub < facts.estimatedStartupBudgetRub * 0.85) {
    delta += pushAdj(
      adjustments,
      "budget_vs_entry",
      "Бюджет ниже типичного порога входа",
      -rules.lowBudgetEntryPenalty,
    );
  }

  if (goals.desiredPaybackMonths <= 4) {
    const profitBoost = (scores.profitScore / 100) * rules.fastPaybackProfitWeight;
    delta += pushAdj(
      adjustments,
      "fast_payback_profit",
      "Короткий срок окупаемости — уклон в прибыльность",
      profitBoost,
    );
    const compRelief =
      ((100 - scores.competitionScore) / 100) * rules.fastPaybackCompetitionRelief;
    delta += pushAdj(
      adjustments,
      "fast_payback_competition",
      "Короткая окупаемость — предпочтение мягче по конкуренции",
      compRelief,
    );
  }

  if (goals.timeHorizonMonths === 12) {
    const g = (scores.growthScore / 100) * rules.twelveMonthGrowthBoost;
    delta += pushAdj(
      adjustments,
      "horizon_12m_growth",
      "Горизонт 12 мес. — уклон в рост",
      g,
    );
  }

  if (
    goals.timeHorizonMonths === 12 &&
    goals.targetRevenueRub >= rules.revenueAmbitionThresholdRub
  ) {
    const g = (scores.growthScore / 100) * rules.revenueAmbitionGrowthBoost;
    delta += pushAdj(
      adjustments,
      "revenue_ambition_12m",
      "Высокая цель по выручке за 12 мес. — доп. уклон в рост",
      g,
    );
  }

  if (goals.targetProfitRub >= rules.profitAmbitionThresholdRub) {
    const p = (scores.profitScore / 100) * rules.profitAmbitionProfitPillarBoost;
    delta += pushAdj(
      adjustments,
      "profit_ambition",
      "Амбициозная цель по прибыли — усиление столба «прибыль»",
      p,
    );
  }

  if (goals.riskTolerance === "high") {
    const g = (scores.growthScore / 100) * rules.highRiskGrowthBoost;
    delta += pushAdj(adjustments, "high_risk_growth", "Высокая толерантность к риску — уклон в рост", g);
    const vol = -facts.seasonalityIndex * rules.highRiskVolatilityPenalty;
    delta += pushAdj(
      adjustments,
      "high_risk_seasonality",
      "Высокая толерантность к риску — штраф за сезонность",
      vol,
    );
  }

  if (goals.riskTolerance === "low") {
    const vol = -facts.seasonalityIndex * rules.lowRiskSeasonalityPenalty;
    delta += pushAdj(
      adjustments,
      "low_risk_seasonality",
      "Низкая толерантность к риску — штраф за волатильную сезонность",
      vol,
    );
    const comp = -(scores.competitionScore / 100) * rules.lowRiskCompetitionPenalty;
    delta += pushAdj(
      adjustments,
      "low_risk_competition",
      "Низкая толерантность к риску — штраф за жёсткую конкуренцию",
      comp,
    );
  }

  if (goals.logisticsCapability === "fbs" && facts.operationalComplexity >= 4) {
    delta += pushAdj(
      adjustments,
      "logistics_fbs_ops",
      "FBS + высокая операционная сложность — риск по исполнению",
      -rules.logisticsFbsComplexityPenalty,
    );
  }

  if (
    goals.logisticsCapability === "fbu" &&
    facts.averagePriceRub < rules.lowTicketPriceRubThreshold
  ) {
    delta += pushAdj(
      adjustments,
      "logistics_fbu_low_ticket",
      "FBU + низкий чек — небольшой плюс к складской модели",
      rules.logisticsFbuLowTicketBoost,
    );
  }

  const personalizedOverall = Math.round(
    Math.min(100, Math.max(0, scores.overallScore + delta)),
  );

  const meta: PersonalizationMeta = {
    rankingAdjustment: Math.round(personalizedOverall - scores.overallScore),
    fitLabel: fitFromPersonalizedScore(personalizedOverall),
    riskLabel: riskFromFactsAndScores(facts, scores),
  };

  return {
    baseOverall: scores.overallScore,
    personalizedOverall,
    meta,
    adjustments,
  };
}

/** Back-compat alias for callers that still use the old name. */
export const personalize = computePersonalization;
