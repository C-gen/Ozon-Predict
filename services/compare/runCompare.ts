import { getNicheById } from "@/data/niches/repository";
import { runAnalysis } from "@/services/analysis/runAnalysis";
import type { UserGoals } from "@/types/goals";
import type { EnrichedNiche } from "@/services/analysis/types";
import { NichesUnavailableForCompareError, UnknownNicheIdsError } from "./errors";

export function runCompare(nicheIds: string[], goals: UserGoals): EnrichedNiche[] {
  const ids = nicheIds.slice(0, 4).filter((id) => typeof id === "string" && id.length > 0);
  const unknown = ids.filter((id) => !getNicheById(id));
  if (unknown.length) {
    throw new UnknownNicheIdsError(unknown);
  }

  const analysis = runAnalysis(goals);
  const set = new Set(ids);
  const rows = analysis.all.filter((n) => set.has(n.facts.id));

  if (rows.length !== ids.length) {
    const missingAfterFilter = ids.filter((id) => !rows.some((r) => r.facts.id === id));
    throw new NichesUnavailableForCompareError(missingAfterFilter);
  }

  return rows;
}
