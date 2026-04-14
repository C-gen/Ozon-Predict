"use client";

import type { RuleAdjustment } from "@/domain/recommendation/types";
import { cn } from "@/lib/utils";
import { ru } from "@/lib/i18n/ru";

export function RankingAdjustments({
  adjustments,
  className,
}: {
  adjustments: RuleAdjustment[] | undefined;
  className?: string;
}) {
  const rows = adjustments ?? [];
  if (!rows.length) return null;

  const ruleWord = rows.length === 1 ? ru.rankingAdjustments.ruleOne : ru.rankingAdjustments.ruleMany;

  return (
    <details className={cn("group rounded-lg border border-dashed bg-muted/20 text-sm", className)}>
      <summary className="cursor-pointer list-none px-3 py-2 font-medium text-muted-foreground transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground/80">
            {ru.rankingAdjustments.summary}
          </span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums text-foreground">
            {rows.length} {ruleWord}
          </span>
          <span className="ml-auto text-xs text-muted-foreground group-open:hidden">
            {ru.rankingAdjustments.show}
          </span>
          <span className="ml-auto hidden text-xs text-muted-foreground group-open:inline">
            {ru.rankingAdjustments.hide}
          </span>
        </span>
      </summary>
      <ul className="space-y-1.5 border-t px-3 py-2 text-xs">
        {rows.map((a) => (
          <li key={`${a.ruleId}-${a.label}`} className="flex justify-between gap-3">
            <span className="text-muted-foreground">{a.label}</span>
            <span
              className={cn(
                "shrink-0 tabular-nums font-medium",
                a.deltaPoints > 0 ? "text-emerald-600" : a.deltaPoints < 0 ? "text-rose-600" : "",
              )}
            >
              {a.deltaPoints > 0 ? "+" : ""}
              {a.deltaPoints}
            </span>
          </li>
        ))}
      </ul>
    </details>
  );
}
