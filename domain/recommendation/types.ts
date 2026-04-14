/**
 * Recommendation / personalization layer on top of core niche scores.
 */

/** Single transparent delta applied when ranking niches for a user. */
export interface RuleAdjustment {
  /** Stable id for analytics / admin (e.g. `preferred_category`). */
  ruleId: string;
  /** Short human label for API / debug panels. */
  label: string;
  /** Points added (positive) or subtracted (negative) before clamping 0–100. */
  deltaPoints: number;
}

export interface PersonalizationMeta {
  /** Net change vs core Overall Score after all rules (post-clamp delta may differ slightly). */
  rankingAdjustment: number;
  fitLabel: "strong" | "good" | "cautious";
  riskLabel: "low" | "medium" | "high";
}

/** Full output of the recommendation engine for one niche. */
export interface PersonalizationResult {
  baseOverall: number;
  personalizedOverall: number;
  meta: PersonalizationMeta;
  adjustments: RuleAdjustment[];
}

/** @deprecated Use `PersonalizationResult` — kept for older imports. */
export type PersonalizedRanking = PersonalizationResult;
