import type { NicheFacts } from "@/domain/niche/types";

/** Competition score: higher means worse competition (harder to win). */
export interface NicheScores {
  demandScore: number;
  profitScore: number;
  competitionScore: number;
  growthScore: number;
  entryScore: number;
  /** Weighted blend: see `OVERALL_WEIGHTS` in `lib/config/scoring.ts`. */
  overallScore: number;
}

/** Derived unit economics used by profit + competition pillars. */
export interface DerivedEconomics {
  netUnitProfitRub: number;
  marginPercent: number;
  saturationProxy: number;
  concentrationPressure: number;
  /** 1 − seasonalityIndex — higher means more stable demand year-round. */
  seasonalityStability: number;
}

/** Full scoring output for one niche (facts + economics + scores). */
export interface ScoredNicheCore {
  facts: NicheFacts;
  economics: DerivedEconomics;
  scores: NicheScores;
}
