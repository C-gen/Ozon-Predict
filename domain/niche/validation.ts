import type { EntryBarrierLevel, NicheFacts } from "./types";

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function isFiniteNumber(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x);
}

function isStringArray(x: unknown): x is string[] {
  return Array.isArray(x) && x.every((i) => typeof i === "string");
}

function isBarrier(x: unknown): x is EntryBarrierLevel {
  return x === 1 || x === 2 || x === 3 || x === 4 || x === 5;
}

/**
 * Runtime guard for external JSON / API payloads before they enter the scoring engine.
 */
export function assertNicheFacts(value: unknown, context = "niche"): NicheFacts {
  if (!isRecord(value)) {
    throw new TypeError(`${context}: expected object`);
  }

  const v = value;

  const id = v.id;
  const name = v.name;
  const category = v.category;
  if (typeof id !== "string" || !id.trim()) throw new TypeError(`${context}.id invalid`);
  if (typeof name !== "string" || !name.trim()) throw new TypeError(`${context}.name invalid`);
  if (typeof category !== "string" || !category.trim()) {
    throw new TypeError(`${context}.category invalid`);
  }

  const numericKeys = [
    "averagePriceRub",
    "estimatedUnitCostRub",
    "estimatedLogisticsCostRub",
    "estimatedMarketplaceCommissionRate",
    "estimatedReturnRate",
    "estimatedMonthlyDemandUnits",
    "demandGrowthRate",
    "numberOfSellers",
    "numberOfSkus",
    "reviewDensity",
    "seasonalityIndex",
    "trendVelocity",
    "estimatedStartupBudgetRub",
    "emergingNicheSignal",
  ] as const;

  for (const key of numericKeys) {
    if (!isFiniteNumber(v[key])) throw new TypeError(`${context}.${String(key)} must be a finite number`);
  }

  if (!isBarrier(v.entryBarrierLevel)) {
    throw new TypeError(`${context}.entryBarrierLevel must be 1–5`);
  }
  if (!isBarrier(v.operationalComplexity)) {
    throw new TypeError(`${context}.operationalComplexity must be 1–5`);
  }
  if (!isBarrier(v.categoryDifficulty)) {
    throw new TypeError(`${context}.categoryDifficulty must be 1–5`);
  }

  if (!isStringArray(v.risks) || v.risks.length === 0) {
    throw new TypeError(`${context}.risks must be a non-empty string[]`);
  }
  if (!isStringArray(v.launchStrategy) || v.launchStrategy.length === 0) {
    throw new TypeError(`${context}.launchStrategy must be a non-empty string[]`);
  }

  return v as unknown as NicheFacts;
}

export function assertNicheFactsArray(value: unknown, context = "niches.seed"): NicheFacts[] {
  if (!Array.isArray(value)) {
    throw new TypeError(`${context}: expected array`);
  }
  return value.map((row, i) => assertNicheFacts(row, `${context}[${i}]`));
}
