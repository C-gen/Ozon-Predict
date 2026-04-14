import { runSimulation } from "@/domain/simulation/service";
import { parseUserGoals } from "@/lib/validation/goals";
import { DEFAULT_GOALS } from "@/types/goals";
import {
  handleApiError,
  jsonOk,
  readJsonBody,
} from "@/lib/api/response";

export const runtime = "nodejs";

/**
 * POST /api/simulate
 * Body: `{ goals?: UserGoals }` — same analysis as `/api/analyze`, echoes goals for what-if UIs.
 */
export async function POST(req: Request) {
  try {
    const body = await readJsonBody(req);
    const rec = body as Record<string, unknown>;
    const goals = rec.goals !== undefined ? parseUserGoals(rec.goals) : DEFAULT_GOALS;
    const result = runSimulation(goals);
    return jsonOk(result);
  } catch (err) {
    return handleApiError(err);
  }
}
