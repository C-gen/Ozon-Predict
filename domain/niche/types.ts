/**
 * Niche domain — facts row shape shared by seed files, warehouse ETL, and APIs.
 */

/** 1 = easiest regulatory/ops surface, 5 = hardest (compliance, media, QC). */
export type EntryBarrierLevel = 1 | 2 | 3 | 4 | 5;

/**
 * Raw niche facts used by scoring, forecasting, and explainability.
 * All money fields are integer RUB; rates are decimals (e.g. 0.17 = 17%).
 */
export interface NicheFacts {
  id: string;
  name: string;
  category: string;
  averagePriceRub: number;
  estimatedUnitCostRub: number;
  estimatedLogisticsCostRub: number;
  estimatedMarketplaceCommissionRate: number;
  estimatedReturnRate: number;
  estimatedMonthlyDemandUnits: number;
  demandGrowthRate: number;
  numberOfSellers: number;
  numberOfSkus: number;
  reviewDensity: number;
  /** 0 = stable year-round demand, 1 = highly seasonal. */
  seasonalityIndex: number;
  entryBarrierLevel: EntryBarrierLevel;
  operationalComplexity: EntryBarrierLevel;
  trendVelocity: number;
  /** Rough CAPEX + first inventory to test the niche (RUB). */
  estimatedStartupBudgetRub: number;
  /** 1 = generic catalog, 5 = compliance-heavy / media-rich. */
  categoryDifficulty: EntryBarrierLevel;
  /** 0–1: higher = earlier-stage / less entrenched leaders. */
  emergingNicheSignal: number;
  risks: string[];
  launchStrategy: string[];
}

/** Future: versioned seed file wrapper `{ version, niches }`. Currently a bare array in JSON. */
export interface NicheSeedFileV1 {
  version: 1;
  niches: NicheFacts[];
}
