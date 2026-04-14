import type { ExperienceLevel, RiskTolerance } from "@/types/goals";

/**
 * Admin-style knobs for recommendation + forecast behavior.
 * Replace with DB-backed config in production.
 */
export const BUSINESS_RULES = {
  ranking: {
    preferredCategoryBoost: 6,
    beginnerCompetitionPenalty: 12,
    beginnerComplexityPenalty: 8,
    /** Fraction of beginner competition penalty applied at intermediate level. */
    intermediateCompetitionFactor: 0.45,
    intermediateComplexityFactor: 0.5,
    lowBudgetEntryPenalty: 14,
    fastPaybackProfitWeight: 10,
    fastPaybackCompetitionRelief: 8,
    twelveMonthGrowthBoost: 7,
    highRiskGrowthBoost: 5,
    highRiskVolatilityPenalty: 6,
    lowRiskSeasonalityPenalty: 4,
    lowRiskCompetitionPenalty: 5,
    /** FBS + high operational load: small drag (seller handles more edge cases). */
    logisticsFbsComplexityPenalty: 4,
    /** FBU + low ticket: slight relief (economies of scale on warehouse SKUs). */
    logisticsFbuLowTicketBoost: 3,
    lowTicketPriceRubThreshold: 750,
    /** Large 12m revenue ambition: extra tilt toward growth-heavy niches. */
    revenueAmbitionThresholdRub: 2_000_000,
    revenueAmbitionGrowthBoost: 5,
    /** Stretch profit goal vs conservative forecast proxy — boosts profit-heavy niches. */
    profitAmbitionThresholdRub: 400_000,
    profitAmbitionProfitPillarBoost: 4,
  },
  forecast: {
    baseShareAdvanced: 0.045,
    baseShareIntermediate: 0.032,
    baseShareBeginner: 0.022,
    competitionShareDrag: 0.55,
    horizonScale: { 1: 0.35, 3: 0.55, 6: 0.78, 12: 1 } as Record<1 | 3 | 6 | 12, number>,
  },
  filters: {
    maxPaybackMultipleVsGoal: 1.35,
  },
} as const;

export function experienceFactor(level: ExperienceLevel): number {
  switch (level) {
    case "beginner":
      return 0.85;
    case "intermediate":
      return 1;
    case "advanced":
      return 1.12;
    default:
      return 1;
  }
}

export function riskGrowthModifier(risk: RiskTolerance): number {
  if (risk === "high") return 1.08;
  if (risk === "low") return 0.92;
  return 1;
}
