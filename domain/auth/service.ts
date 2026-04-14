import type { MockSession } from "./types";

/** MVP stub — replace with real auth provider. */
export function getMockSession(): MockSession {
  return {
    userId: "demo-user",
    email: "seller@example.com",
    plan: "demo",
  };
}
