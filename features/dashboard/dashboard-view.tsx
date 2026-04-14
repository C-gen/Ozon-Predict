"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/store/useAppStore";
import { NicheCard } from "@/components/niche/niche-card";
import { ScenarioCalculator } from "@/components/simulation/scenario-calculator";
import { GoalSummaryStrip } from "@/components/dashboard/goal-summary-strip";
import { CategoryFocusGrid } from "@/components/dashboard/category-focus-grid";
import { ScoreLeadersTable } from "@/components/dashboard/score-leaders-table";
import { ScatterDemandCompetition } from "@/components/charts/scatter-demand-competition";
import { ProfitVsEntryChart } from "@/components/charts/profit-vs-entry";
import { ForecastLinesChart } from "@/components/charts/forecast-lines";
import { LeaderboardBar } from "@/components/charts/leaderboard-bar";
import type { AnalysisResult } from "@/services/analysis/types";
import { goalsFingerprint } from "@/utils/goals-fingerprint";
import { cn } from "@/lib/utils";
import { ru } from "@/lib/i18n/ru";

export function DashboardView() {
  const goals = useAppStore((s) => s.goals);
  const analysis = useAppStore((s) => s.analysis);
  const analysisGoalsFingerprint = useAppStore((s) => s.analysisGoalsFingerprint);
  const setAnalysis = useAppStore((s) => s.setAnalysis);
  const selectedCompareIds = useAppStore((s) => s.selectedCompareIds);
  const { requestFailed: errRequestFailed, dashboardLoad: errDashboardLoad } = ru.errors;

  const fp = goalsFingerprint(goals);
  const analysisFresh = Boolean(analysis && analysisGoalsFingerprint === fp);

  const [loading, setLoading] = useState(!analysisFresh);
  const [error, setError] = useState<string | null>(null);

  const loadAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goals }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(typeof j.error === "string" ? j.error : errRequestFailed);
      }
      const json = await res.json();
      setAnalysis(json.analysis as AnalysisResult, goalsFingerprint(goals));
    } catch (e) {
      setError(e instanceof Error ? e.message : errDashboardLoad);
    } finally {
      setLoading(false);
    }
  }, [goals, setAnalysis, errRequestFailed, errDashboardLoad]);

  useEffect(() => {
    if (analysisFresh) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    void (async () => {
      await loadAnalysis();
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, [analysisFresh, loadAnalysis]);

  if (loading && !analysis) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full max-w-xl rounded-lg" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <Skeleton className="h-[420px] rounded-xl" />
      </div>
    );
  }

  if (error && !analysis) {
    return (
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle>{ru.errors.generic}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={() => void loadAnalysis()}>{ru.actions.retry}</Button>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="relative space-y-8 pb-10">
      {loading ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-end pt-2">
          <div className="flex items-center gap-2 rounded-full border bg-background/90 px-3 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur">
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            {ru.actions.refreshing}
          </div>
        </div>
      ) : null}

      <section className="overflow-hidden rounded-2xl border bg-gradient-to-br from-card via-card to-muted/40 p-6 shadow-sm md:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary/80">
              Дашборд
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              Подбор ниш под ваши цели
            </h1>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
              Общий score, ключевые метрики и прогнозы в одном месте. После изменений в целях и
              сценариях нажмите «Обновить».
            </p>
            <GoalSummaryStrip goals={goals} />
          </div>
          <div className="flex min-w-0 shrink-0 flex-col gap-2 sm:flex-row lg:max-w-[11rem] lg:flex-col">
            <Button asChild variant="outline" className="justify-center whitespace-normal text-center">
              <Link href="/onboarding">{ru.actions.editGoals}</Link>
            </Button>
            <Button
              variant="secondary"
              className="justify-center gap-2"
              onClick={() => void loadAnalysis()}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 shrink-0 ${loading ? "animate-spin" : ""}`} />
              {ru.actions.refreshData}
            </Button>
            {selectedCompareIds.length >= 2 ? (
              <Button asChild className="justify-center">
                <Link href="/compare">
                  {ru.actions.compare} ({selectedCompareIds.length})
                </Link>
              </Button>
            ) : (
              <Button variant="outline" disabled className="justify-center">
                Сравнить от 2 ниш
              </Button>
            )}
          </div>
        </div>
      </section>

      {error ? (
        <p className="text-sm text-amber-700 dark:text-amber-400">{error}</p>
      ) : null}

      <section className="grid gap-3.5 md:grid-cols-3">
        <Kpi title="Сводка по рискам" value={analysis.metrics.riskSummary} multiline />
        <Kpi title="Сводка прогноза" value={analysis.metrics.forecastSummary} multiline />
        <Kpi
          title="Средняя окупаемость"
          value={
            analysis.metrics.avgPaybackMonths
              ? `${analysis.metrics.avgPaybackMonths} мес., по портфелю`
              : ru.forecast.na
          }
        />
      </section>

      <CategoryFocusGrid niches={analysis.all} />

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/80 shadow-sm lg:col-span-2">
          <CardHeader className="space-y-1 pb-2.5">
            <CardTitle className="text-lg">Рекомендованные ниши</CardTitle>
            <p className="text-sm text-muted-foreground">
              Сортировка по персональному рангу, на карточках — общий score и прогноз в рублях.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {analysis.top.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                По фильтрам ничего не нашлось. Уберите часть исключений на странице «Цели».
              </div>
            ) : (
              analysis.top.slice(0, 3).map((n) => <NicheCard key={n.facts.id} niche={n} />)
            )}
          </CardContent>
        </Card>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ScenarioCalculator />
        </div>
      </section>

      <Card className="border-border/80 shadow-sm">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg">Сравнение</CardTitle>
            <p className="text-sm text-muted-foreground">
              Отметьте ниши на карточках и откройте таблицу рядом.
            </p>
          </div>
          <Button asChild variant="secondary" className="shrink-0 self-start sm:self-center">
            <Link href="/compare">{ru.actions.openCompare}</Link>
          </Button>
        </CardHeader>
      </Card>

      <section className="space-y-3">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Аналитика по нишам</h2>
          <p className="text-sm text-muted-foreground">Графики и рейтинг помогают быстро выделить приоритетные ниши.</p>
        </div>
        <Tabs defaultValue="charts" className="space-y-4">
        <TabsList className="grid h-auto w-full max-w-full grid-cols-2 gap-1 rounded-lg bg-muted p-1 sm:max-w-md">
          <TabsTrigger value="charts" className="text-xs sm:text-sm">
            Графики
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="text-xs sm:text-sm">
            Рейтинг по score
          </TabsTrigger>
        </TabsList>
        <TabsContent value="charts" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Спрос vs конкуренция"
              subtitle="Ищите точки выше и левее: высокий спрос при менее жёсткой конкуренции."
            >
              <ScatterDemandCompetition data={analysis.charts.scatterDemandVsCompetition} />
            </ChartCard>
            <ChartCard
              title="Прибыль vs сложность входа"
              subtitle="Выше и левее обычно дают лучший баланс: выше прибыль и проще старт."
            >
              <ProfitVsEntryChart data={analysis.charts.profitVsEntryDifficulty} />
            </ChartCard>
            <ChartCard
              title="Прогноз выручки и прибыли"
              subtitle="Динамика по месяцам для лидера текущего ранга."
            >
              <ForecastLinesChart data={analysis.charts.forecastByHorizon} />
            </ChartCard>
            <ChartCard title="Почему лидер" subtitle="Короткие причины из модели.">
              <div className="space-y-3 px-1 py-2">
                <div className="text-sm font-semibold">{analysis.top[0]?.facts.name ?? "—"}</div>
                <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                  {analysis.top[0]?.recommendationReasons.map((r) => (
                    <li key={r} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                      <span>{r}</span>
                    </li>
                  )) ?? <li className="text-muted-foreground">Причины недоступны.</li>}
                </ul>
              </div>
            </ChartCard>
          </div>
        </TabsContent>
        <TabsContent value="leaderboard">
          <div className="grid gap-6 xl:grid-cols-5">
            <ChartCard
              className="xl:col-span-3"
              title="Топ ниш по общему score"
              subtitle="Слева — названия ниш, справа — значение общего score (0-100)."
            >
              <LeaderboardBar data={analysis.charts.leaderboard} />
            </ChartCard>
            <div className="xl:col-span-2">
              <ScoreLeadersTable niches={analysis.all} />
            </div>
          </div>
        </TabsContent>
        </Tabs>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Полный список</h2>
          <p className="text-sm text-muted-foreground">{analysis.all.length} ниш в расчёте</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {analysis.all.map((n) => (
            <NicheCard key={n.facts.id} niche={n} compact />
          ))}
        </div>
      </section>
    </div>
  );
}

function Kpi({
  title,
  value,
  multiline,
}: {
  title: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={multiline ? "text-sm leading-relaxed text-foreground" : ""}>
        {multiline ? value : <div className="text-2xl font-semibold tabular-nums">{value}</div>}
      </CardContent>
    </Card>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("h-full border-border/80 shadow-sm", className)}>
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {subtitle ? <p className="text-xs leading-relaxed text-muted-foreground">{subtitle}</p> : null}
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}
