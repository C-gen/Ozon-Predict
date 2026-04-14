"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CompareTable } from "@/components/compare/compare-table";
import { CompareScoresBar } from "@/components/charts/compare-scores-bar";
import { useAppStore } from "@/store/useAppStore";
import { getNicheById } from "@/data/niches/repository";
import { runCompare } from "@/services/compare/runCompare";
import type { EnrichedNiche } from "@/services/analysis/types";
import { ru } from "@/lib/i18n/ru";

export default function ComparePage() {
  const goals = useAppStore((s) => s.goals);
  const selectedCompareIds = useAppStore((s) => s.selectedCompareIds);
  const clearCompare = useAppStore((s) => s.clearCompare);
  const toggleCompareId = useAppStore((s) => s.toggleCompareId);

  const [niches, setNiches] = useState<EnrichedNiche[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (selectedCompareIds.length < 2) {
        setNiches([]);
        setError(null);
        setErrorCode(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      setErrorCode(null);
      try {
        const compared = runCompare(selectedCompareIds, goals);
        if (!cancelled) setNiches(compared as EnrichedNiche[]);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : ru.errors.compareLoad);
          const code = e && typeof e === "object" && "code" in e ? String((e as { code?: string }).code ?? "") : "";
          setErrorCode(code || null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [goals, selectedCompareIds]);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Сравнение ниш</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            До четырёх ниш в одной таблице: score, прогнозы и экономика. Выбор совпадает с кнопкой «В
            сравнение» на дашборде.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard">{ru.actions.backToDashboard}</Link>
          </Button>
          <Button variant="outline" onClick={() => clearCompare()}>
            {ru.actions.clearAll}
          </Button>
        </div>
      </div>

      {selectedCompareIds.length > 0 ? (
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Текущий выбор</CardTitle>
            <p className="text-xs text-muted-foreground">
              Нажмите ×, чтобы убрать нишу перед повторным сравнением.
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {selectedCompareIds.map((id) => {
              const raw = getNicheById(id);
              return (
                <Badge
                  key={id}
                  variant="secondary"
                  className="gap-1.5 py-1.5 pl-2.5 pr-1 font-normal"
                >
                  <span className="max-w-[200px] truncate">{raw?.name ?? id}</span>
                  <button
                    type="button"
                    className="-mr-1 inline-flex min-h-9 min-w-9 items-center justify-center rounded-md hover:bg-background/80"
                    aria-label={`Убрать ${raw?.name ?? id}`}
                    onClick={() => toggleCompareId(id)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Badge>
              );
            })}
          </CardContent>
        </Card>
      ) : null}

      {selectedCompareIds.length < 2 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Выберите минимум две ниши</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>На карточках дашборда нажмите «В сравнение», затем вернитесь сюда.</p>
            <Button asChild>
              <Link href="/dashboard">На дашборд</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {error ? (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">{ru.errors.couldNotCompare}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>{error}</p>
            {errorCode ? (
              <p className="text-xs text-muted-foreground">
                {ru.errors.codePrefix}: <span className="font-mono">{errorCode}</span>
              </p>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {loading && selectedCompareIds.length >= 2 ? (
        <div className="space-y-3">
          <Skeleton className="h-[280px] w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      ) : null}

      {!loading && niches && niches.length >= 2 ? (
        <div className="space-y-8">
          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Профили score</CardTitle>
              <p className="text-sm text-muted-foreground">
                Общий / прибыль / спрос / конкуренция (0–100). По конкуренции: выше score — жёстче
                рынок.
              </p>
            </CardHeader>
            <CardContent>
              <CompareScoresBar niches={niches} />
            </CardContent>
          </Card>
          <div>
            <h2 className="mb-3 text-lg font-semibold">Детальная таблица</h2>
            <CompareTable niches={niches} />
          </div>
        </div>
      ) : !loading && selectedCompareIds.length >= 2 && niches && niches.length < 2 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Недостаточно ниш в ответе. Измените выбор или цели.
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
