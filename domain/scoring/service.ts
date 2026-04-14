/**
 * Back-compat entry: handlers may import `@/domain/scoring/service`.
 * Implementation lives in `engine.ts` + `formulas.ts` + `helpers.ts`.
 */
export { scoreNiche } from "./engine";
export type { ScoredNicheCore, DerivedEconomics, NicheScores } from "./types";
