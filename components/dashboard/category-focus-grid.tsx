"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { EnrichedNiche } from "@/services/analysis/types";

type CategoryItem = {
  category: string;
  niches: number;
  avgScore: number;
  topNiche: string;
};

function buildCategoryStats(niches: EnrichedNiche[]): CategoryItem[] {
  const grouped = new Map<string, EnrichedNiche[]>();
  for (const niche of niches) {
    const key = niche.facts.category;
    const existing = grouped.get(key) ?? [];
    existing.push(niche);
    grouped.set(key, existing);
  }

  return Array.from(grouped.entries())
    .map(([category, items]) => {
      const avgScore = Math.round(items.reduce((sum, item) => sum + item.overallScore, 0) / items.length);
      const best = items.reduce((bestItem, current) =>
        current.overallScore > bestItem.overallScore ? current : bestItem,
      );
      return {
        category,
        niches: items.length,
        avgScore,
        topNiche: best.facts.name,
      };
    })
    .sort((a, b) => b.avgScore - a.avgScore || b.niches - a.niches)
    .slice(0, 6);
}

function scoreTone(score: number): string {
  if (score >= 78) return "text-emerald-600";
  if (score >= 62) return "text-sky-600";
  if (score >= 45) return "text-amber-600";
  return "text-rose-600";
}

function scoreBarTone(score: number): string {
  if (score >= 78) return "bg-emerald-500/90";
  if (score >= 62) return "bg-sky-500/90";
  if (score >= 45) return "bg-amber-500/90";
  return "bg-rose-500/90";
}

export function CategoryFocusGrid({ niches }: { niches: EnrichedNiche[] }) {
  const categories = buildCategoryStats(niches);

  return (
    <section className="space-y-3">
      <div className="space-y-1.5">
        <h2 className="text-xl font-semibold tracking-tight">Подходящие категории ниш</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Категории подобраны с учётом ваших целей по выручке, прибыли, горизонту и допустимому риску.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((item, idx) => (
          <Card key={item.category} className="h-full border-border/80 shadow-sm">
            <CardContent className="flex h-full flex-col gap-3.5 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-2.5">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold tabular-nums text-muted-foreground">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="line-clamp-2 text-sm font-semibold leading-snug">{item.category}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{item.niches} ниш в расчёте</div>
                  </div>
                </div>
                <div className={`shrink-0 text-2xl font-semibold tabular-nums leading-none ${scoreTone(item.avgScore)}`}>
                  {item.avgScore}
                </div>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/90">
                <div
                  className={`h-full rounded-full ${scoreBarTone(item.avgScore)}`}
                  style={{ width: `${item.avgScore}%` }}
                />
              </div>
              <div className="mt-auto rounded-lg border bg-muted/35 p-3">
                <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Лучшая ниша</div>
                <div className="mt-1 line-clamp-2 text-sm leading-relaxed text-foreground">{item.topNiche}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
