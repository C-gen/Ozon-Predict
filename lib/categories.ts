import { NICHE_SEEDS } from "@/data/niches/niche-seeds";

export const CATEGORY_OPTIONS = Array.from(
  new Set(NICHE_SEEDS.map((n) => n.category)),
).sort();
