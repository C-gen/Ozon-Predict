import type { NicheFacts } from "@/domain/niche/types";
import { loadNicheSeedsFromDisk } from "./load-seed";

/**
 * Canonical demo niches — sourced from `niches.seed.json` (generated / edited there).
 */
export const NICHE_SEEDS: NicheFacts[] = loadNicheSeedsFromDisk();
