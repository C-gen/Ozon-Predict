import type {
  ExperienceLevel,
  LogisticsCapability,
  RiskTolerance,
  TimeHorizonMonths,
  UserGoals,
} from "@/types/goals";
import { DEFAULT_GOALS } from "@/types/goals";

const HORIZONS = new Set<TimeHorizonMonths>([1, 3, 6, 12]);
const RISKS = new Set<RiskTolerance>(["low", "medium", "high"]);
const EXP = new Set<ExperienceLevel>(["beginner", "intermediate", "advanced"]);
const LOG = new Set<LogisticsCapability>(["fbu", "fbs", "mixed"]);

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export function parseUserGoals(input: unknown): UserGoals {
  if (!isRecord(input)) return DEFAULT_GOALS;

  const g = input;

  const timeHorizonMonths = g.timeHorizonMonths;
  const th: TimeHorizonMonths = HORIZONS.has(timeHorizonMonths as TimeHorizonMonths)
    ? (timeHorizonMonths as TimeHorizonMonths)
    : DEFAULT_GOALS.timeHorizonMonths;

  const riskTolerance = RISKS.has(g.riskTolerance as RiskTolerance)
    ? (g.riskTolerance as RiskTolerance)
    : DEFAULT_GOALS.riskTolerance;

  const experienceLevel = EXP.has(g.experienceLevel as ExperienceLevel)
    ? (g.experienceLevel as ExperienceLevel)
    : DEFAULT_GOALS.experienceLevel;

  const logisticsCapability = LOG.has(g.logisticsCapability as LogisticsCapability)
    ? (g.logisticsCapability as LogisticsCapability)
    : DEFAULT_GOALS.logisticsCapability;

  const preferredCategories = Array.isArray(g.preferredCategories)
    ? g.preferredCategories.filter((x): x is string => typeof x === "string")
    : [];

  const excludedCategories = Array.isArray(g.excludedCategories)
    ? g.excludedCategories.filter((x): x is string => typeof x === "string")
    : [];

  return {
    targetRevenueRub: num(g.targetRevenueRub, DEFAULT_GOALS.targetRevenueRub),
    targetProfitRub: num(g.targetProfitRub, DEFAULT_GOALS.targetProfitRub),
    timeHorizonMonths: th,
    availableBudgetRub: num(g.availableBudgetRub, DEFAULT_GOALS.availableBudgetRub),
    riskTolerance,
    preferredCategories,
    excludedCategories,
    logisticsCapability,
    experienceLevel,
    desiredPaybackMonths: num(g.desiredPaybackMonths, DEFAULT_GOALS.desiredPaybackMonths),
  };
}

function num(v: unknown, fallback: number): number {
  if (typeof v === "number" && Number.isFinite(v)) return Math.max(0, v);
  if (typeof v === "string" && Number.isFinite(Number(v))) return Math.max(0, Number(v));
  return fallback;
}
