import { parseUserGoals } from "@/lib/validation/goals";
import { DEFAULT_GOALS } from "@/types/goals";
import { runCompare } from "@/services/compare/runCompare";
import {
  NichesUnavailableForCompareError,
  UnknownNicheIdsError,
} from "@/services/compare/errors";
import {
  handleApiError,
  jsonError,
  jsonOk,
  readJsonBody,
} from "@/lib/api/response";
import { ru } from "@/lib/i18n/ru";

export const runtime = "nodejs";

/**
 * POST /api/compare
 * Body: `{ nicheIds: string[], goals?: UserGoals }` — 2–4 ids, validated against seed + goal filters.
 */
export async function POST(req: Request) {
  try {
    const body = await readJsonBody(req);
    const rec = body as Record<string, unknown>;
    const nicheIds = rec.nicheIds;
    if (!Array.isArray(nicheIds) || nicheIds.length < 2) {
      return jsonError(ru.api.compareNeedTwo, 400, "invalid_body");
    }
    const ids = nicheIds
      .filter((x): x is string => typeof x === "string" && x.length > 0)
      .slice(0, 4);
    if (ids.length < 2) {
      return jsonError(ru.api.compareIdsInvalid, 400, "invalid_body");
    }
    const goals = rec.goals !== undefined ? parseUserGoals(rec.goals) : DEFAULT_GOALS;
    const niches = runCompare(ids, goals);
    return jsonOk({ niches });
  } catch (err) {
    if (err instanceof UnknownNicheIdsError) {
      return jsonError(err.message, 400, "unknown_niche");
    }
    if (err instanceof NichesUnavailableForCompareError) {
      return jsonError(err.message, 400, "niche_unavailable");
    }
    return handleApiError(err);
  }
}
