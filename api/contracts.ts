/**
 * Re-exports API DTOs from `types/api.ts`.
 * Route handlers live in `app/api/**`; keep request/response shapes in one place.
 */
export type {
  AnalyzeRequestBody,
  AnalyzeResponseBody,
  CompareRequestBody,
  CompareResponseBody,
  SimulateRequestBody,
  SimulateResponseBody,
  RecommendationsResponseBody,
} from "@/types/api";
