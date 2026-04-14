import { runAnalysis } from "@/services/analysis/runAnalysis";
import type { UserGoals } from "@/types/goals";
import type { SimulationResponse } from "./types";

export function runSimulation(goals: UserGoals): SimulationResponse {
  return {
    goals,
    analysis: runAnalysis(goals),
  };
}
