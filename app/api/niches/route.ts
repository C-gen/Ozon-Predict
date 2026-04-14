import { listNiches } from "@/data/niches/repository";
import { jsonOk } from "@/lib/api/response";

export const runtime = "nodejs";

/**
 * GET /api/niches
 * Query: `?category=Storage` — optional case-insensitive category filter on raw seed rows.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category")?.trim();
  let niches = listNiches();
  if (category) {
    const c = category.toLowerCase();
    niches = niches.filter((n) => n.category.toLowerCase() === c);
  }
  return jsonOk({ niches, count: niches.length });
}
