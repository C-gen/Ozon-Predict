import type { NicheFacts } from "@/domain/niche/types";
import type { NicheScores } from "@/domain/scoring/types";
import type { NicheForecast } from "@/domain/forecast/types";
import type { PersonalizationMeta, RuleAdjustment } from "@/domain/recommendation/types";

export interface EnrichedNiche {
  facts: NicheFacts;
  scores: NicheScores;
  forecast: NicheForecast;
  /** Weighted Overall Niche Score (core model). */
  overallScore: number;
  /** Used only for ordering recommendations after personalization. */
  rankScore: number;
  profitScore: number;
  demandScore: number;
  competitionScore: number;
  growthScore: number;
  entryScore: number;
  recommendationReasons: string[];
  personalization: PersonalizationMeta;
  /** Audit trail for ranking deltas (recommendation engine). */
  rankingAdjustments: RuleAdjustment[];
}

export interface DashboardMetrics {
  riskSummary: string;
  forecastSummary: string;
  avgPaybackMonths: number | null;
  topCategory: string | null;
}

export interface ChartModels {
  scatterDemandVsCompetition: Array<{
    id: string;
    name: string;
    demandScore: number;
    competitionScore: number;
    category: string;
  }>;
  profitVsEntryDifficulty: Array<{
    id: string;
    name: string;
    profitScore: number;
    entryDifficulty: number;
  }>;
  forecastByHorizon: Array<{ month: number; revenue: number; profit: number }>;
  leaderboard: Array<{ id: string; name: string; overallScore: number }>;
}

export interface AnalysisResult {
  generatedAt: string;
  top: EnrichedNiche[];
  all: EnrichedNiche[];
  metrics: DashboardMetrics;
  charts: ChartModels;
}
