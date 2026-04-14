import type { UserGoals } from "./goals";
import type { AnalysisResult, EnrichedNiche } from "@/services/analysis/types";

export interface AnalyzeRequestBody {
  goals: UserGoals;
}

export interface AnalyzeResponseBody {
  analysis: AnalysisResult;
}

export interface CompareRequestBody {
  nicheIds: string[];
  goals: UserGoals;
}

export interface CompareResponseBody {
  niches: EnrichedNiche[];
}

export interface SimulateRequestBody {
  goals: UserGoals;
}

export interface SimulateResponseBody {
  goals: UserGoals;
  analysis: AnalysisResult;
}

/** Lighter ranking payload without full dashboard chart models. */
export interface RecommendationsResponseBody {
  goals: UserGoals;
  generatedAt: string;
  /** Full ranked list after personalization. */
  recommendations: EnrichedNiche[];
  /** Top slice (same as `analysis.top` from `/api/analyze`). */
  top: EnrichedNiche[];
}
