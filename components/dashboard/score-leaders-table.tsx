"use client";

import type { EnrichedNiche } from "@/services/analysis/types";
import { Card, CardContent } from "@/components/ui/card";

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

export function ScoreLeadersTable({ niches }: { niches: EnrichedNiche[] }) {
  const top = [...niches].sort((a, b) => b.overallScore - a.overallScore).slice(0, 6);

  return (
    <Card className="h-full border-border/80 shadow-sm">
      <CardContent className="space-y-3.5 p-5">
        <div className="space-y-1.5">
          <h3 className="text-base font-semibold">Лидеры по общему score</h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Позиция, общий score и ключевые драйверы для быстрого сравнения ниш.
          </p>
        </div>
        <div className="grid grid-cols-[2rem_minmax(0,1fr)_4.2rem] items-center gap-3 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <div className="text-center">#</div>
          <div>Ниша</div>
          <div className="text-right">Score</div>
        </div>
        <div className="space-y-2">
          {top.map((item, idx) => (
            <div
              key={item.facts.id}
              className="grid min-h-16 grid-cols-[2rem_minmax(0,1fr)_4.2rem] items-center gap-3 rounded-lg border bg-card/70 px-3 py-2.5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold tabular-nums text-muted-foreground">
                {idx + 1}
              </div>
              <div className="min-w-0 space-y-1">
                <div className="truncate text-sm font-medium">{item.facts.name}</div>
                <div className="truncate text-xs text-muted-foreground">
                  Прибыль {item.profitScore} • Спрос {item.demandScore} • Конкуренция {item.competitionScore}
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-muted/90">
                  <div className={`h-full rounded-full ${scoreBarTone(item.overallScore)}`} style={{ width: `${item.overallScore}%` }} />
                </div>
              </div>
              <div className={`text-right text-xl font-semibold tabular-nums ${scoreTone(item.overallScore)}`}>
                {item.overallScore}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
