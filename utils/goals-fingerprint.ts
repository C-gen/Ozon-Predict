import type { UserGoals } from "@/types/goals";

/** Stable string for detecting when stored analysis is stale vs current goals. */
export function goalsFingerprint(goals: UserGoals): string {
  return JSON.stringify({
    targetRevenueRub: goals.targetRevenueRub,
    targetProfitRub: goals.targetProfitRub,
    timeHorizonMonths: goals.timeHorizonMonths,
    availableBudgetRub: goals.availableBudgetRub,
    riskTolerance: goals.riskTolerance,
    preferredCategories: [...goals.preferredCategories].sort((a, b) => a.localeCompare(b)),
    excludedCategories: [...goals.excludedCategories].sort((a, b) => a.localeCompare(b)),
    logisticsCapability: goals.logisticsCapability,
    experienceLevel: goals.experienceLevel,
    desiredPaybackMonths: goals.desiredPaybackMonths,
  });
}
