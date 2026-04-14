import { getNicheById } from "@/data/niches/repository";
import { runAnalysis } from "@/services/analysis/runAnalysis";
import { DEFAULT_GOALS } from "@/types/goals";
import { parseUserGoals } from "@/lib/validation/goals";
import { jsonError, jsonOk } from "@/lib/api/response";
import { ru } from "@/lib/i18n/ru";

export const runtime = "nodejs";

/**
 * GET /api/niches/:id
 * Query: `goals` — optional JSON string of `UserGoals` for enriched scoring context.
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const facts = getNicheById(params.id);
  if (!facts) {
    return jsonError(ru.api.nicheNotFound, 404, "not_found");
  }

  const url = new URL(req.url);
  const goalsParam = url.searchParams.get("goals");
  let goals = DEFAULT_GOALS;
  if (goalsParam) {
    try {
      goals = parseUserGoals(JSON.parse(goalsParam));
    } catch {
      return jsonError(ru.api.invalidGoalsQuery, 400, "invalid_goals");
    }
  }

  const analysis = runAnalysis(goals);
  const enriched = analysis.all.find((n) => n.facts.id === params.id);
  if (!enriched) {
    return jsonError(ru.api.nicheExcludedByFilters, 404, "excluded_or_filtered");
  }

  return jsonOk({ niche: enriched });
}
