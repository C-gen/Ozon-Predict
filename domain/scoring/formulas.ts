import { OVERALL_WEIGHTS, PILLAR_WEIGHTS } from "@/lib/config/scoring";
import type { NicheFacts } from "@/domain/niche/types";
import {
  demandVolumeScore,
  demandGrowthComponent,
  trendComponent,
  seasonalityStabilityScore,
  marginScore,
  netUnitScore,
  returnPenaltyScore,
  growthScoreParts,
  entryParts,
} from "./helpers";
import type { DerivedEconomics } from "./types";

export function blendDemandScore(n: NicheFacts, e: DerivedEconomics): number {
  const w = PILLAR_WEIGHTS.demand;
  const vol = demandVolumeScore(n);
  const growth = demandGrowthComponent(n);
  const trend = trendComponent(n);
  const stability = seasonalityStabilityScore(e);
  return Math.round(
    vol * w.volume + growth * w.growth + trend * w.trend + stability * w.seasonalityStability,
  );
}

export function blendProfitScore(n: NicheFacts, e: DerivedEconomics): number {
  const w = PILLAR_WEIGHTS.profit;
  const m = marginScore(e);
  const net = netUnitScore(e);
  const ret = returnPenaltyScore(n);
  return Math.round(m * w.marginPct + net * w.netPerUnit + ret * w.returnPenalty);
}

export function blendGrowthScore(n: NicheFacts): number {
  const w = PILLAR_WEIGHTS.growth;
  const parts = growthScoreParts(n);
  return Math.round(
    parts.demandGrowth * w.demandGrowth +
      parts.trend * w.trendVelocity +
      parts.emerging * w.emergingSignal,
  );
}

export function blendEntryScore(n: NicheFacts): number {
  const w = PILLAR_WEIGHTS.entry;
  const p = entryParts(n);
  return Math.round(
    p.budgetFit * w.budgetFit +
      p.barrier * w.barrier +
      p.complexity * w.operationalComplexity +
      p.categoryDifficulty * w.categoryDifficulty,
  );
}

/**
 * Overall Niche Score (0–100):
 * Demand*0.30 + Profit*0.30 + (100−Competition)*0.25 + Growth*0.10 + Entry*0.05
 */
export function overallFromPillars(
  demand: number,
  profit: number,
  competition: number,
  growth: number,
  entry: number,
): number {
  const w = OVERALL_WEIGHTS;
  const compInverted = 100 - competition;
  const raw =
    demand * w.demand +
    profit * w.profit +
    compInverted * w.competitionInverted +
    growth * w.growth +
    entry * w.entry;
  return Math.round(Math.min(100, Math.max(0, raw)));
}
