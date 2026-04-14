import { runAnalysis } from "@/services/analysis/runAnalysis";
import { parseUserGoals } from "@/lib/validation/goals";
import { DEFAULT_GOALS } from "@/types/goals";
import {
  handleApiError,
  jsonOk,
  readJsonBody,
} from "@/lib/api/response";

export const runtime = "nodejs";

/**
 * POST /api/analyze
 * Body: `{ goals?: UserGoals }` — runs scoring + recommendation + forecast pipeline.
 */
export async function POST(req: Request) {
  try {
    const body = await readJsonBody(req);
    const rec = body as Record<string, unknown>;
    const goals = rec.goals !== undefined ? parseUserGoals(rec.goals) : DEFAULT_GOALS;
    const analysis = runAnalysis(goals);
    return jsonOk({ analysis });
  } catch (err) {
    return handleApiError(err);
  }
}
