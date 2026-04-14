import type { NicheFacts } from "@/domain/niche/types";
import { loadNicheSeedsFromDisk } from "./load-seed";

/** Data access boundary — replace implementation with SQL/API later. */
export function listNiches(): NicheFacts[] {
  return loadNicheSeedsFromDisk();
}

export function getNicheById(id: string): NicheFacts | undefined {
  return loadNicheSeedsFromDisk().find((n) => n.id === id);
}
