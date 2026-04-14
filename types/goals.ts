export type TimeHorizonMonths = 1 | 3 | 6 | 12;

export type RiskTolerance = "low" | "medium" | "high";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export type LogisticsCapability = "fbu" | "fbs" | "mixed";

/** Business goals collected during onboarding / simulation. */
export interface UserGoals {
  targetRevenueRub: number;
  targetProfitRub: number;
  timeHorizonMonths: TimeHorizonMonths;
  availableBudgetRub: number;
  riskTolerance: RiskTolerance;
  preferredCategories: string[];
  excludedCategories: string[];
  logisticsCapability: LogisticsCapability;
  experienceLevel: ExperienceLevel;
  desiredPaybackMonths: number;
}

export const DEFAULT_GOALS: UserGoals = {
  targetRevenueRub: 1_200_000,
  targetProfitRub: 280_000,
  timeHorizonMonths: 6,
  availableBudgetRub: 350_000,
  riskTolerance: "medium",
  preferredCategories: [],
  excludedCategories: [],
  logisticsCapability: "mixed",
  experienceLevel: "intermediate",
  desiredPaybackMonths: 5,
};
