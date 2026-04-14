import type { NicheFacts } from "./types";
import { assertNicheFacts } from "./validation";

/**
 * Maps untrusted JSON (HTTP body, file import) into a validated `NicheFacts`.
 */
export function toNicheFacts(raw: unknown): NicheFacts {
  return assertNicheFacts(raw, "payload");
}
