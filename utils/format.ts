const RUB = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

export function formatMoneyRub(value: number): string {
  return RUB.format(Math.round(value));
}

export function formatPercent(value: number, fractionDigits = 0): string {
  return `${(value * 100).toFixed(fractionDigits)}%`;
}

export function scoreHueClass(score: number): string {
  if (score >= 78) return "text-emerald-600";
  if (score >= 62) return "text-sky-600";
  if (score >= 45) return "text-amber-600";
  return "text-rose-600";
}

export function competitionHueClass(score: number): string {
  if (score <= 40) return "text-emerald-600";
  if (score <= 60) return "text-amber-600";
  return "text-rose-600";
}
