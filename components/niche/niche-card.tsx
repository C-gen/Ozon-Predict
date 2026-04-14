"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { EnrichedNiche } from "@/services/analysis/types";
import { formatMoneyRub } from "@/utils/format";
import { useAppStore } from "@/store/useAppStore";
import { RankingAdjustments } from "@/components/niche/ranking-adjustments";
import { NicheScoreMatrix } from "@/components/niche/niche-score-matrix";
import { cn } from "@/lib/utils";
import { fitLabelRu, riskLabelRu, ru } from "@/lib/i18n/ru";

export function NicheCard({
  niche,
  showCompareActions = true,
  compact = false,
}: {
  niche: EnrichedNiche;
  showCompareActions?: boolean;
  compact?: boolean;
}) {
  const toggleCompare = useAppStore((s) => s.toggleCompareId);
  const selected = useAppStore((s) => s.selectedCompareIds.includes(niche.facts.id));
  const rankDelta = niche.rankScore - niche.overallScore;
  const adjustments = niche.rankingAdjustments ?? [];

  return (
    <Card
      className={cn(
        "group overflow-hidden border-border/80 bg-card/80 shadow-sm transition-all duration-200",
        "hover:border-primary/20 hover:shadow-md",
      )}
    >
      <CardHeader className={cn("space-y-2 pb-3", compact ? "pb-2" : "")}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base font-semibold leading-snug tracking-tight">
              {niche.facts.name}
            </CardTitle>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Badge variant="outline" className="font-normal">
                {niche.facts.category}
              </Badge>
              <Badge
                variant={
                  niche.personalization.fitLabel === "strong"
                    ? "default"
                    : niche.personalization.fitLabel === "good"
                      ? "secondary"
                      : "outline"
                }
                className="font-normal"
              >
                {fitLabelRu(niche.personalization.fitLabel)}
              </Badge>
              <Badge variant="outline" className="font-normal">
                Риск: {riskLabelRu(niche.personalization.riskLabel)}
              </Badge>
              {rankDelta !== 0 ? (
                <Badge variant="secondary" className="font-mono text-xs font-normal tabular-nums">
                  к рангу {rankDelta > 0 ? "+" : ""}
                  {rankDelta}
                </Badge>
              ) : null}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className={cn("space-y-4", compact ? "space-y-3" : "")}>
        <NicheScoreMatrix
          overallScore={niche.overallScore}
          profitScore={niche.profitScore}
          demandScore={niche.demandScore}
          competitionScore={niche.competitionScore}
          growthScore={niche.growthScore}
          compact={compact}
        />

        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-lg border border-transparent bg-muted/50 p-3">
            <div className="text-[11px] font-medium text-muted-foreground">{ru.forecast.revenue}</div>
            <div className="text-sm font-semibold tabular-nums">
              {formatMoneyRub(niche.forecast.forecastedMonthlyRevenueRub)}
              <span className="text-xs font-normal text-muted-foreground"> {ru.forecast.perMonth}</span>
            </div>
          </div>
          <div className="rounded-lg border border-transparent bg-muted/50 p-3">
            <div className="text-[11px] font-medium text-muted-foreground">{ru.forecast.profit}</div>
            <div className="text-sm font-semibold tabular-nums">
              {formatMoneyRub(niche.forecast.forecastedMonthlyProfitRub)}
              <span className="text-xs font-normal text-muted-foreground"> {ru.forecast.perMonth}</span>
            </div>
          </div>
          <div className="rounded-lg border border-transparent bg-muted/50 p-3">
            <div className="text-[11px] font-medium text-muted-foreground">{ru.forecast.payback}</div>
            <div className="text-sm font-semibold tabular-nums">
              {niche.forecast.estimatedPaybackMonths
                ? `${niche.forecast.estimatedPaybackMonths} ${ru.forecast.monthsShort}`
                : ru.forecast.na}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Причины рекомендации
          </div>
          <ul className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">
            {(compact ? niche.recommendationReasons.slice(0, 3) : niche.recommendationReasons.slice(0, 4)).map(
              (r) => (
                <li key={r} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/70" />
                  <span>{r}</span>
                </li>
              ),
            )}
          </ul>
        </div>

        <RankingAdjustments adjustments={adjustments} />

        <Separator className="opacity-60" />

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild size="sm" className="gap-1">
            <Link href={`/niches/${niche.facts.id}`}>
              {ru.actions.viewDetails} <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
            </Link>
          </Button>
          {showCompareActions ? (
            <Button
              size="sm"
              variant={selected ? "default" : "outline"}
              onClick={() => toggleCompare(niche.facts.id)}
            >
              {selected ? ru.actions.inCompare : ru.actions.addToCompare}
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
