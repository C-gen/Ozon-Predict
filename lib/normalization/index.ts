/**
 * Helpers to map raw metrics into 0–100 bands for scoring pillars.
 */

export function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function toScore(clampedUnit: number): number {
  return Math.round(clamp01(clampedUnit) * 100);
}

/** Linear normalize: value within [min,max] → [0,1], inverted optional. */
export function normalizeLinear(
  value: number,
  min: number,
  max: number,
  invert = false,
): number {
  if (max === min) return 0.5;
  const t = (value - min) / (max - min);
  const u = clamp01(t);
  return invert ? 1 - u : u;
}

/** Smooth curve for nicer distribution around mid values. */
export function soften(t: number, power = 0.92): number {
  const u = clamp01(t);
  return Math.pow(u, power);
}
