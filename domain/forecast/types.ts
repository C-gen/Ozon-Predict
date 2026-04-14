import type { TimeHorizonMonths } from "@/types/goals";

export interface NicheForecast {
  horizonMonths: TimeHorizonMonths;
  /** Expected achievable monthly units at maturity within horizon. */
  forecastedMonthlyUnits: number;
  forecastedMonthlyRevenueRub: number;
  forecastedMonthlyProfitRub: number;
  estimatedPaybackMonths: number | null;
  /** 0–1 confidence heuristic for MVP dashboards. */
  confidence: number;
}
