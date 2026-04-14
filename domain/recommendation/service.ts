/**
 * Recommendation domain — ranking adjustments on top of core scores.
 */
export {
  computePersonalization,
  personalize,
} from "./engine";
export type {
  PersonalizationResult,
  PersonalizationMeta,
  RuleAdjustment,
  PersonalizedRanking,
} from "./types";
export {
  hasPreferredCategory,
  isExcludedCategory,
  filterExcluded,
} from "./helpers";
