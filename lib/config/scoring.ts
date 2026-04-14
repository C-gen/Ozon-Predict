/**
 * Central scoring weights for the Overall Niche Score.
 * Tune here without touching service code.
 */
export const OVERALL_WEIGHTS = {
  demand: 0.3,
  profit: 0.3,
  competitionInverted: 0.25,
  growth: 0.1,
  entry: 0.05,
} as const;

/** Sub-score blend weights inside each pillar (readable + configurable). */
export const PILLAR_WEIGHTS = {
  demand: {
    volume: 0.45,
    growth: 0.25,
    trend: 0.2,
    seasonalityStability: 0.1,
  },
  profit: {
    marginPct: 0.45,
    netPerUnit: 0.35,
    returnPenalty: 0.2,
  },
  competition: {
    sellers: 0.35,
    skus: 0.25,
    reviewDensity: 0.2,
    saturation: 0.2,
  },
  growth: {
    demandGrowth: 0.45,
    trendVelocity: 0.35,
    emergingSignal: 0.2,
  },
  entry: {
    budgetFit: 0.35,
    barrier: 0.3,
    operationalComplexity: 0.2,
    categoryDifficulty: 0.15,
  },
} as const;

/** Reference bands for normalizing raw metrics to 0–100 (MVP heuristic). */
export const NORMALIZATION_BANDS = {
  monthlyDemandUnits: { min: 400, max: 12000 },
  demandGrowthRate: { min: -0.08, max: 0.35 },
  trendVelocity: { min: -0.15, max: 0.4 },
  seasonalityIndex: { min: 0.05, max: 0.95 },
  sellerCount: { min: 25, max: 900 },
  skuCount: { min: 120, max: 9000 },
  reviewDensity: { min: 0.02, max: 0.55 },
  marginPct: { min: 0.08, max: 0.52 },
  netUnitProfitRub: { min: 40, max: 2200 },
  returnRate: { min: 0.01, max: 0.22 },
  entryBudgetRub: { min: 40_000, max: 900_000 },
  barrierLevel: { min: 1, max: 5 },
  operationalComplexity: { min: 1, max: 5 },
  categoryDifficulty: { min: 1, max: 5 },
} as const;
