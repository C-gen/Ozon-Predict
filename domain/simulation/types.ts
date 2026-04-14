import type { UserGoals } from "@/types/goals";
import type { AnalysisResult } from "@/services/analysis/types";

export interface SimulationRequest {
  goals: UserGoals;
}

export interface SimulationResponse {
  goals: UserGoals;
  analysis: AnalysisResult;
}
