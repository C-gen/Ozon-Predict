import { NORMALIZATION_BANDS, PILLAR_WEIGHTS } from "@/lib/config/scoring";
import { normalizeLinear, soften, toScore } from "@/lib/normalization";
import type { NicheFacts } from "@/domain/niche/types";
import type { DerivedEconomics } from "./types";

export function computeDerivedEconomics(n: NicheFacts): DerivedEconomics {
  const commission = n.averagePriceRub * n.estimatedMarketplaceCommissionRate;
  const netUnitProfitRub =
    n.averagePriceRub -
    n.estimatedUnitCostRub -
    n.estimatedLogisticsCostRub -
    commission -
    n.averagePriceRub * n.estimatedReturnRate;
  const marginPercent = n.averagePriceRub > 0 ? netUnitProfitRub / n.averagePriceRub : 0;

  const sellerPressure = n.numberOfSellers / (n.estimatedMonthlyDemandUnits + 1);
  const skuPressure = n.numberOfSkus / (n.estimatedMonthlyDemandUnits + 1);
  const concentrationPressure = Math.min(1, sellerPressure * 0.55 + skuPressure * 0.45);

  const saturationProxy = Math.min(
    1,
    n.reviewDensity * 0.55 + concentrationPressure * 0.45,
  );

  const seasonalityStability = 1 - n.seasonalityIndex;

  return {
    netUnitProfitRub,
    marginPercent,
    saturationProxy,
    concentrationPressure,
    seasonalityStability,
  };
}

export function demandVolumeScore(n: NicheFacts): number {
  const t = normalizeLinear(
    n.estimatedMonthlyDemandUnits,
    NORMALIZATION_BANDS.monthlyDemandUnits.min,
    NORMALIZATION_BANDS.monthlyDemandUnits.max,
  );
  return toScore(soften(t));
}

export function demandGrowthComponent(n: NicheFacts): number {
  const t = normalizeLinear(
    n.demandGrowthRate,
    NORMALIZATION_BANDS.demandGrowthRate.min,
    NORMALIZATION_BANDS.demandGrowthRate.max,
  );
  return toScore(soften(t));
}

export function trendComponent(n: NicheFacts): number {
  const t = normalizeLinear(
    n.trendVelocity,
    NORMALIZATION_BANDS.trendVelocity.min,
    NORMALIZATION_BANDS.trendVelocity.max,
  );
  return toScore(soften(t));
}

export function seasonalityStabilityScore(e: DerivedEconomics): number {
  const t = normalizeLinear(e.seasonalityStability, 0.05, 0.95);
  return toScore(soften(t));
}

export function marginScore(e: DerivedEconomics): number {
  const t = normalizeLinear(
    e.marginPercent,
    NORMALIZATION_BANDS.marginPct.min,
    NORMALIZATION_BANDS.marginPct.max,
  );
  return toScore(soften(t));
}

export function netUnitScore(e: DerivedEconomics): number {
  const t = normalizeLinear(
    e.netUnitProfitRub,
    NORMALIZATION_BANDS.netUnitProfitRub.min,
    NORMALIZATION_BANDS.netUnitProfitRub.max,
  );
  return toScore(soften(t));
}

export function returnPenaltyScore(n: NicheFacts): number {
  const t = normalizeLinear(
    n.estimatedReturnRate,
    NORMALIZATION_BANDS.returnRate.min,
    NORMALIZATION_BANDS.returnRate.max,
    true,
  );
  return toScore(soften(t));
}

/**
 * Competition pillar: higher score = worse market structure for a new entrant.
 * Uses `PILLAR_WEIGHTS.competition` for seller/SKU/review/saturation blend.
 */
export function competitionFromFacts(n: NicheFacts, e: DerivedEconomics): number {
  const w = PILLAR_WEIGHTS.competition;
  const sellers = normalizeLinear(
    n.numberOfSellers,
    NORMALIZATION_BANDS.sellerCount.min,
    NORMALIZATION_BANDS.sellerCount.max,
  );
  const skus = normalizeLinear(
    n.numberOfSkus,
    NORMALIZATION_BANDS.skuCount.min,
    NORMALIZATION_BANDS.skuCount.max,
  );
  const reviews = normalizeLinear(
    n.reviewDensity,
    NORMALIZATION_BANDS.reviewDensity.min,
    NORMALIZATION_BANDS.reviewDensity.max,
  );
  const saturation = soften(e.saturationProxy);

  const blend =
    sellers * w.sellers + skus * w.skus + reviews * w.reviewDensity + saturation * w.saturation;
  return toScore(blend);
}

export function growthScoreParts(n: NicheFacts): {
  demandGrowth: number;
  trend: number;
  emerging: number;
} {
  const demandGrowth = demandGrowthComponent(n);
  const trend = trendComponent(n);
  const emerging = toScore(soften(n.emergingNicheSignal));
  return { demandGrowth, trend, emerging };
}

export function entryParts(n: NicheFacts): {
  budgetFit: number;
  barrier: number;
  complexity: number;
  categoryDifficulty: number;
} {
  const budgetFit = normalizeLinear(
    n.estimatedStartupBudgetRub,
    NORMALIZATION_BANDS.entryBudgetRub.min,
    NORMALIZATION_BANDS.entryBudgetRub.max,
    true,
  );
  const barrier = normalizeLinear(
    n.entryBarrierLevel,
    NORMALIZATION_BANDS.barrierLevel.min,
    NORMALIZATION_BANDS.barrierLevel.max,
    true,
  );
  const complexity = normalizeLinear(
    n.operationalComplexity,
    NORMALIZATION_BANDS.operationalComplexity.min,
    NORMALIZATION_BANDS.operationalComplexity.max,
    true,
  );
  const categoryDifficulty = normalizeLinear(
    n.categoryDifficulty,
    NORMALIZATION_BANDS.categoryDifficulty.min,
    NORMALIZATION_BANDS.categoryDifficulty.max,
    true,
  );
  return {
    budgetFit: toScore(soften(budgetFit)),
    barrier: toScore(soften(barrier)),
    complexity: toScore(soften(complexity)),
    categoryDifficulty: toScore(soften(categoryDifficulty)),
  };
}
