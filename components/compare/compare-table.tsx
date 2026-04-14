"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { EnrichedNiche } from "@/services/analysis/types";
import { formatMoneyRub, scoreHueClass, competitionHueClass } from "@/utils/format";
import { ru } from "@/lib/i18n/ru";

export function CompareTable({ niches }: { niches: EnrichedNiche[] }) {
  if (!niches.length) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/20 p-10 text-center text-sm text-muted-foreground">
        Выберите 2–4 ниши на дашборде, затем откройте «Сравнение».
      </div>
    );
  }

  return (
    <div>
      <p className="mb-2 text-xs text-muted-foreground md:hidden">
        Листайте таблицу горизонтально, чтобы увидеть все столбцы.
      </p>
      <div className="overflow-x-auto overscroll-x-contain rounded-xl border bg-card shadow-sm [-webkit-overflow-scrolling:touch]">
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-muted/40 hover:bg-muted/40">
              <TableHead className="sticky left-0 z-20 min-w-[108px] bg-muted/95 backdrop-blur supports-[backdrop-filter]:bg-muted/80">
                Действия
              </TableHead>
              <TableHead className="min-w-[200px]">Ниша</TableHead>
              <TableHead className="text-right">Ранг-score</TableHead>
              <TableHead className="text-right">{ru.scores.overall}</TableHead>
              <TableHead className="text-right">{ru.scores.profit}</TableHead>
              <TableHead className="text-right">{ru.scores.demand}</TableHead>
              <TableHead className="text-right">{ru.scores.competition}</TableHead>
              <TableHead className="text-right">{ru.scores.growth}</TableHead>
              <TableHead className="text-right">{ru.scores.entry}</TableHead>
              <TableHead className="text-right">{ru.forecast.revenue}</TableHead>
              <TableHead className="text-right">{ru.forecast.profit}</TableHead>
              <TableHead className="text-right">{ru.forecast.payback}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {niches.map((n) => (
              <TableRow key={n.facts.id} className="hover:bg-muted/30">
                <TableCell className="sticky left-0 z-10 bg-card align-middle shadow-[4px_0_12px_-4px_rgba(0,0,0,0.08)]">
                  <Button asChild variant="outline" size="sm" className="min-h-10 px-3 sm:min-h-9 sm:h-8">
                    <Link href={`/niches/${n.facts.id}`}>{ru.actions.viewDetails}</Link>
                  </Button>
                </TableCell>
                <TableCell className="max-w-[240px] align-top">
                  <div className="font-medium leading-snug">{n.facts.name}</div>
                  <div className="text-xs text-muted-foreground">{n.facts.category}</div>
                </TableCell>
                <TableCell className={`text-right font-medium tabular-nums ${scoreHueClass(n.rankScore)}`}>
                  {n.rankScore}
                </TableCell>
                <TableCell className={`text-right tabular-nums ${scoreHueClass(n.overallScore)}`}>
                  {n.overallScore}
                </TableCell>
                <TableCell className={`text-right tabular-nums ${scoreHueClass(n.profitScore)}`}>
                  {n.profitScore}
                </TableCell>
                <TableCell className={`text-right tabular-nums ${scoreHueClass(n.demandScore)}`}>
                  {n.demandScore}
                </TableCell>
                <TableCell className={`text-right tabular-nums ${competitionHueClass(n.competitionScore)}`}>
                  {n.competitionScore}
                </TableCell>
                <TableCell className="text-right tabular-nums">{n.growthScore}</TableCell>
                <TableCell className="text-right tabular-nums">{n.entryScore}</TableCell>
                <TableCell className="text-right text-sm tabular-nums">
                  {formatMoneyRub(n.forecast.forecastedMonthlyRevenueRub)}
                </TableCell>
                <TableCell className="text-right text-sm tabular-nums">
                  {formatMoneyRub(n.forecast.forecastedMonthlyProfitRub)}
                </TableCell>
                <TableCell className="text-right text-sm tabular-nums">
                  {n.forecast.estimatedPaybackMonths
                    ? `${n.forecast.estimatedPaybackMonths} ${ru.forecast.monthsShort}`
                    : ru.forecast.na}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
