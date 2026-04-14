import { runAnalysis } from "@/services/analysis/runAnalysis";
import { parseUserGoals } from "@/lib/validation/goals";
import { DEFAULT_GOALS } from "@/types/goals";
import type { RecommendationsResponseBody } from "@/types/api";
import {
  handleApiError,
  jsonOk,
  readJsonBody,
} from "@/lib/api/response";

export const runtime = "nodejs";

/**
 * POST /api/recommendations
 * Body: `{ goals?: UserGoals }` — ranked niches without full dashboard chart payload.
 */
export async function POST(req: Request) {
  try {
    const body = await readJsonBody(req);
    const rec = body as Record<string, unknown>;
    const goals = rec.goals !== undefined ? parseUserGoals(rec.goals) : DEFAULT_GOALS;
    const analysis = runAnalysis(goals);
    const payload: RecommendationsResponseBody = {
      goals,
      generatedAt: analysis.generatedAt,
      recommendations: analysis.all,
      top: analysis.top,
    };
    return jsonOk(payload);
  } catch (err) {
    return handleApiError(err);
  }
}
