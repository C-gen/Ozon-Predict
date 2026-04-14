import { scoreNiche } from "@/domain/scoring/service";
import { forecastNiche } from "@/domain/forecast/service";
import { filterExcluded, personalize } from "@/domain/recommendation/service";
import { buildRecommendationReasons } from "@/domain/explanation/service";
import { listNiches } from "@/data/niches/repository";
import type { UserGoals } from "@/types/goals";
import type { AnalysisResult, EnrichedNiche } from "./types";

function entryDifficulty(entryScore: number): number {
  return Math.round(100 - entryScore);
}

function buildCharts(niches: EnrichedNiche[], goals: UserGoals) {
  const scatterDemandVsCompetition = niches.map((n) => ({
    id: n.facts.id,
    name: n.facts.name,
    demandScore: n.scores.demandScore,
    competitionScore: n.scores.competitionScore,
    category: n.facts.category,
  }));

  const profitVsEntryDifficulty = niches.map((n) => ({
    id: n.facts.id,
    name: n.facts.name,
    profitScore: n.scores.profitScore,
    entryDifficulty: entryDifficulty(n.scores.entryScore),
  }));

  const months =
    goals.timeHorizonMonths === 1
      ? [1]
      : goals.timeHorizonMonths === 3
        ? [1, 2, 3]
        : goals.timeHorizonMonths === 6
          ? [1, 2, 3, 4, 5, 6]
          : [2, 4, 6, 8, 10, 12];

  const top = niches[0];
  const forecastByHorizon = months.map((m) => {
    const scale = m / goals.timeHorizonMonths;
    return {
      month: m,
      revenue: Math.round(top.forecast.forecastedMonthlyRevenueRub * scale),
      profit: Math.round(top.forecast.forecastedMonthlyProfitRub * scale),
    };
  });

  const leaderboard = [...niches]
    .sort((a, b) => b.rankScore - a.rankScore)
    .slice(0, 8)
    .map((n) => ({
      id: n.facts.id,
      name: n.facts.name,
      overallScore: n.overallScore,
    }));

  return {
    scatterDemandVsCompetition,
    profitVsEntryDifficulty,
    forecastByHorizon,
    leaderboard,
  };
}

function metricsFrom(niches: EnrichedNiche[], goals: UserGoals) {
  const pays = niches
    .map((n) => n.forecast.estimatedPaybackMonths)
    .filter((v): v is number => typeof v === "number");
  const avgPaybackMonths =
    pays.length > 0
      ? Math.round(pays.reduce((a, b) => a + b, 0) / pays.length)
      : null;

  const topCategory = niches[0]?.facts.category ?? null;

  const highRisk = niches.filter((n) => n.personalization.riskLabel === "high").length;
  const riskSummary =
    highRisk > niches.length / 2
      ? "Много ниш с высоким риском — закладывайте запас по марже и логистике."
      : "Риски в целом умеренные: можно тестировать гипотезы без крайних ставок.";

  const forecastSummary = `Горизонт ${goals.timeHorizonMonths} мес.: базовый сценарий — достижимая доля спроса с учётом опыта и конкуренции.`;

  return {
    riskSummary,
    forecastSummary,
    avgPaybackMonths,
    topCategory,
  };
}

export function runAnalysis(goals: UserGoals): AnalysisResult {
  const factsList = listNiches().filter((f) => filterExcluded(goals, f));

  const enriched: EnrichedNiche[] = factsList.map((facts) => {
    const scored = scoreNiche(facts);
    const forecast = forecastNiche(facts, scored.scores, goals);
    const p = personalize(facts, scored.scores, goals);
    const recommendationReasons = buildRecommendationReasons({
      facts,
      scores: scored.scores,
      goals,
      forecast,
      personalization: p.meta,
    });

    return {
      facts,
      scores: scored.scores,
      forecast,
      overallScore: scored.scores.overallScore,
      rankScore: p.personalizedOverall,
      profitScore: scored.scores.profitScore,
      demandScore: scored.scores.demandScore,
      competitionScore: scored.scores.competitionScore,
      growthScore: scored.scores.growthScore,
      entryScore: scored.scores.entryScore,
      recommendationReasons,
      personalization: p.meta,
      rankingAdjustments: p.adjustments,
    };
  });

  const sorted = [...enriched].sort((a, b) => b.rankScore - a.rankScore);
  const top = sorted.slice(0, 8);

  return {
    generatedAt: new Date().toISOString(),
    top,
    all: sorted,
    metrics: metricsFrom(sorted, goals),
    charts: buildCharts(sorted, goals),
  };
}
