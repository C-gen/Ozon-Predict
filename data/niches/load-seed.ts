import type { NicheFacts } from "@/domain/niche/types";
import { assertNicheFactsArray } from "@/domain/niche/validation";
import rawSeed from "./niches.seed.json";

let cached: NicheFacts[] | null = null;

/**
 * Loads and validates `data/niches/niches.seed.json` once per process.
 * Swap this module for DB/API hydration without changing scoring code.
 */
export function loadNicheSeedsFromDisk(): NicheFacts[] {
  if (cached) return cached;
  cached = assertNicheFactsArray(rawSeed, "data/niches/niches.seed.json");
  return cached;
}
