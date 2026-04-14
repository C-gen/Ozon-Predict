import { BUSINESS_RULES, experienceFactor, riskGrowthModifier } from "@/lib/config/business-rules";
import type { NicheFacts } from "@/domain/niche/types";
import type { UserGoals } from "@/types/goals";
import type { NicheScores } from "@/domain/scoring/types";
import type { NicheForecast } from "./types";

function baseShare(goals: UserGoals): number {
  const cfg = BUSINESS_RULES.forecast;
  if (goals.experienceLevel === "advanced") return cfg.baseShareAdvanced;
  if (goals.experienceLevel === "beginner") return cfg.baseShareBeginner;
  return cfg.baseShareIntermediate;
}

/**
 * Deterministic MVP forecast. Replace internals with model outputs later.
 */
export function forecastNiche(
  facts: NicheFacts,
  scores: NicheScores,
  goals: UserGoals,
): NicheForecast {
  const horizon = goals.timeHorizonMonths;
  const horizonScale = BUSINESS_RULES.forecast.horizonScale[horizon];

  const competitionDrag =
    1 -
    (scores.competitionScore / 100) * BUSINESS_RULES.forecast.competitionShareDrag;

  const experience = experienceFactor(goals.experienceLevel);
  const risk = riskGrowthModifier(goals.riskTolerance);

  const achievableShare =
    baseShare(goals) * competitionDrag * experience * risk;

  const growthLift = 1 + facts.demandGrowthRate * 0.65 + facts.trendVelocity * 0.45;

  const forecastedMonthlyUnits = Math.round(
    facts.estimatedMonthlyDemandUnits *
      achievableShare *
      growthLift *
      horizonScale,
  );

  const forecastedMonthlyRevenueRub = Math.round(
    forecastedMonthlyUnits * facts.averagePriceRub,
  );

  const commission =
    facts.averagePriceRub * facts.estimatedMarketplaceCommissionRate;
  const netPerUnit =
    facts.averagePriceRub -
    facts.estimatedUnitCostRub -
    facts.estimatedLogisticsCostRub -
    commission -
    facts.averagePriceRub * facts.estimatedReturnRate;

  const forecastedMonthlyProfitRub = Math.round(
    Math.max(0, forecastedMonthlyUnits * netPerUnit),
  );

  const estimatedPaybackMonths =
    forecastedMonthlyProfitRub > 0
      ? Math.max(
          1,
          Math.round(goals.availableBudgetRub / forecastedMonthlyProfitRub),
        )
      : null;

  const confidence = Math.min(
    1,
    Math.max(
      0.35,
      scores.overallScore / 100 - scores.competitionScore / 250 + horizonScale * 0.15,
    ),
  );

  return {
    horizonMonths: horizon,
    forecastedMonthlyUnits,
    forecastedMonthlyRevenueRub,
    forecastedMonthlyProfitRub,
    estimatedPaybackMonths,
    confidence,
  };
}
