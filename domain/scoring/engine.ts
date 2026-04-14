import type { NicheFacts } from "@/domain/niche/types";
import { computeDerivedEconomics, competitionFromFacts } from "./helpers";
import {
  blendDemandScore,
  blendEntryScore,
  blendGrowthScore,
  blendProfitScore,
  overallFromPillars,
} from "./formulas";
import type { NicheScores, ScoredNicheCore } from "./types";

/**
 * Scoring engine entrypoint — pure functions over `NicheFacts`.
 * Replace internals with calibrated models; keep this function signature stable for APIs.
 */
export function scoreNiche(facts: NicheFacts): ScoredNicheCore {
  const economics = computeDerivedEconomics(facts);
  const demandScore = blendDemandScore(facts, economics);
  const profitScore = blendProfitScore(facts, economics);
  const competitionScore = competitionFromFacts(facts, economics);
  const growthScore = blendGrowthScore(facts);
  const entryScore = blendEntryScore(facts);
  const overallScore = overallFromPillars(
    demandScore,
    profitScore,
    competitionScore,
    growthScore,
    entryScore,
  );

  const scores: NicheScores = {
    demandScore,
    profitScore,
    competitionScore,
    growthScore,
    entryScore,
    overallScore,
  };

  return { facts, economics, scores };
}
