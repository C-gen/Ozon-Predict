"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadarScoreProfile } from "@/components/charts/radar-score-profile";
import { RankingAdjustments } from "@/components/niche/ranking-adjustments";
import { useAppStore } from "@/store/useAppStore";
import type { AnalysisResult, EnrichedNiche } from "@/services/analysis/types";
import { runAnalysis } from "@/services/analysis/runAnalysis";
import {
  formatMoneyRub,
  formatPercent,
  scoreHueClass,
  competitionHueClass,
} from "@/utils/format";
import { goalsFingerprint } from "@/utils/goals-fingerprint";
import { fitLabelRu, logisticsLabelRu, riskLabelRu, ru } from "@/lib/i18n/ru";

export default function NicheDetailClientPage() {
  const params = useParams<{ id: string }>();
  const goals = useAppStore((s) => s.goals);
  const analysis = useAppStore((s) => s.analysis);
  const analysisGoalsFingerprint = useAppStore((s) => s.analysisGoalsFingerprint);

  const fp = goalsFingerprint(goals);
  const analysisFresh = Boolean(analysis && analysisGoalsFingerprint === fp);

  const fromStore = useMemo(() => {
    if (!analysis) return undefined;
    return analysis.all.find((n) => n.facts.id === params.id);
  }, [analysis, params.id]);

  const [niche, setNiche] = useState<EnrichedNiche | undefined>(fromStore);
  const [loading, setLoading] = useState(!(fromStore && analysisFresh));
  const [rankSnapshot, setRankSnapshot] = useState<EnrichedNiche[] | null>(null);

  useEffect(() => {
    if (fromStore && analysisFresh) {
      setNiche(fromStore);
      setRankSnapshot(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function load() {
      setLoading(true);
      if (!analysisFresh) setRankSnapshot(null);
      try {
        const computed = runAnalysis(goals) as AnalysisResult;
        const all = computed.all;
        if (!all) {
          if (!cancelled) setNiche(undefined);
          return;
        }
        if (!cancelled) {
          setRankSnapshot(all);
          setNiche(all.find((n) => n.facts.id === params.id));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [fromStore, analysisFresh, goals, params.id]);

  const rankNav = useMemo(() => {
    if (!niche) return { prev: null as string | null, next: null as string | null };
    const source =
      analysisFresh && analysis
        ? analysis.all
        : rankSnapshot ?? (!loading ? analysis?.all ?? [] : []);
    if (!source.length) return { prev: null, next: null };
    const ordered = [...source].sort((a, b) => b.rankScore - a.rankScore);
    const idx = ordered.findIndex((n) => n.facts.id === niche.facts.id);
    if (idx < 0) return { prev: null, next: null };
    return {
      prev: idx > 0 ? ordered[idx - 1].facts.id : null,
      next: idx < ordered.length - 1 ? ordered[idx + 1].facts.id : null,
    };
  }, [analysis, analysisFresh, loading, niche, rankSnapshot]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <Skeleton className="h-10 w-2/3 rounded-lg" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (!niche) {
    return (
      <Card className="mx-auto max-w-lg border-dashed">
        <CardHeader>
          <CardTitle>Ниша не найдена</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Такого id нет в демо-каталоге или ниша скрыта текущими фильтрами по категориям.
          </p>
          <Button asChild variant="outline">
            <Link href="/dashboard">{ru.actions.backToDashboard}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const f = niche.facts;
  const commissionRub = f.averagePriceRub * f.estimatedMarketplaceCommissionRate;

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground">
              Дашборд
            </Link>
            <span>/</span>
            <span className="text-foreground">Ниша</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{f.category}</Badge>
            <Badge variant="secondary">{fitLabelRu(niche.personalization.fitLabel)}</Badge>
            <Badge variant="outline">Риск: {riskLabelRu(niche.personalization.riskLabel)}</Badge>
            {niche.rankScore !== niche.overallScore ? (
              <Badge variant="outline" className="font-mono tabular-nums">
                Ранг-score {niche.rankScore}
              </Badge>
            ) : null}
          </div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight">{f.name}</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Демо-профиль: базовая модель скоринга, персональные поправки к рангу и эвристический прогноз.
          </p>
        </div>
        <div className="flex min-w-0 shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap">
          {rankNav.prev ? (
            <Button asChild variant="outline" size="sm" className="gap-1" title="Предыдущая в списке">
              <Link href={`/niches/${rankNav.prev}`}>
                <ChevronLeft className="h-4 w-4 shrink-0" />
                <span className="sm:hidden">Выше</span>
                <span className="hidden sm:inline">Выше в списке</span>
              </Link>
            </Button>
          ) : null}
          {rankNav.next ? (
            <Button asChild variant="outline" size="sm" className="gap-1" title="Следующая в списке">
              <Link href={`/niches/${rankNav.next}`}>
                <span className="sm:hidden">Ниже</span>
                <span className="hidden sm:inline">Ниже в списке</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </Link>
            </Button>
          ) : null}
          <Button asChild variant="secondary" size="sm">
            <Link href="/dashboard">{ru.actions.back}</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/80 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Структура score</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Score label={ru.scores.overall} value={niche.overallScore} />
            <Score label={ru.scores.profit} value={niche.profitScore} />
            <Score label={ru.scores.demand} value={niche.demandScore} />
            <Score label={ru.scores.competition} value={niche.competitionScore} competition />
            <Score label={ru.scores.growth} value={niche.growthScore} />
            <Score label={ru.scores.entry} value={niche.entryScore} />
          </CardContent>
        </Card>
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Радар</CardTitle>
            <p className="text-xs text-muted-foreground">
              Конкуренция показана как «лёгкость» (100 − score конкуренции) для наглядности.
            </p>
          </CardHeader>
          <CardContent>
            <RadarScoreProfile
              demand={niche.demandScore}
              profit={niche.profitScore}
              competition={niche.competitionScore}
              growth={niche.growthScore}
              entry={niche.entryScore}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricTile
          label={ru.forecast.revenue}
          value={formatMoneyRub(niche.forecast.forecastedMonthlyRevenueRub)}
          hint="в месяц"
        />
        <MetricTile
          label={ru.forecast.profit}
          value={formatMoneyRub(niche.forecast.forecastedMonthlyProfitRub)}
          hint="в месяц"
        />
        <MetricTile
          label={ru.forecast.payback}
          value={
            niche.forecast.estimatedPaybackMonths
              ? `${niche.forecast.estimatedPaybackMonths} мес.`
              : ru.forecast.na
          }
          hint="оценка модели"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid h-auto w-full max-w-full grid-cols-2 gap-1 p-1 sm:max-w-xl sm:grid-cols-4">
          <TabsTrigger value="overview" className="px-2 text-xs leading-tight sm:text-sm">
            Обзор
          </TabsTrigger>
          <TabsTrigger value="economics" className="px-2 text-xs leading-tight sm:text-sm">
            Экономика
          </TabsTrigger>
          <TabsTrigger value="strategy" className="px-2 text-xs leading-tight sm:text-sm">
            Стратегия
          </TabsTrigger>
          <TabsTrigger value="ranking" className="px-2 text-xs leading-tight sm:text-sm">
            Ранг
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Причины рекомендации</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                {niche.recommendationReasons.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="economics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Юнит-экономика (демо)</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody className="divide-y">
                  <Row k="Средняя цена" v={formatMoneyRub(f.averagePriceRub)} />
                  <Row k="Себестоимость (оценка)" v={formatMoneyRub(f.estimatedUnitCostRub)} />
                  <Row k="Логистика (оценка)" v={formatMoneyRub(f.estimatedLogisticsCostRub)} />
                  <Row k="Комиссия площадки (оценка)" v={formatMoneyRub(commissionRub)} />
                  <Row k="Ставка комиссии" v={formatPercent(f.estimatedMarketplaceCommissionRate, 0)} />
                  <Row k="Доля возвратов (оценка)" v={formatPercent(f.estimatedReturnRate, 1)} />
                  <Row k="Спрос в месяц, шт. (оценка)" v={String(f.estimatedMonthlyDemandUnits)} />
                  <Row k="Рост спроса" v={formatPercent(f.demandGrowthRate, 1)} />
                  <Row k="Скорость тренда" v={formatPercent(f.trendVelocity, 1)} />
                  <Row k="Индекс сезонности" v={formatPercent(f.seasonalityIndex, 0)} />
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategy" className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Риски</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {f.risks.map((r) => (
                <div key={r} className="flex gap-2">
                  <span className="select-none text-rose-500">•</span>
                  <span>{r}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Идеи по запуску</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {f.launchStrategy.map((r) => (
                <div key={r} className="flex gap-2">
                  <span className="select-none text-emerald-600">•</span>
                  <span>{r}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ranking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Персонализация и базовая модель</CardTitle>
              <p className="text-sm text-muted-foreground">
                Общий score остаётся по взвешенной формуле; ранг-score учитывает правила ниже при
                сортировке.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-6 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">{ru.scores.overall}</div>
                  <div className={`text-2xl font-semibold tabular-nums ${scoreHueClass(niche.overallScore)}`}>
                    {niche.overallScore}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Ранг-score</div>
                  <div className={`text-2xl font-semibold tabular-nums ${scoreHueClass(niche.rankScore)}`}>
                    {niche.rankScore}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Суммарная корректировка</div>
                  <div className="text-2xl font-semibold tabular-nums text-foreground">
                    {niche.personalization.rankingAdjustment > 0 ? "+" : ""}
                    {niche.personalization.rankingAdjustment}
                  </div>
                </div>
              </div>
              <RankingAdjustments adjustments={niche.rankingAdjustments} className="max-w-xl" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />

      <p className="text-xs text-muted-foreground">
        Стартовый бюджет (демо): {formatMoneyRub(f.estimatedStartupBudgetRub)} · Логистика:{" "}
        {logisticsLabelRu(goals.logisticsCapability)} · Продавцов / карточек: {f.numberOfSellers} /{" "}
        {f.numberOfSkus}
      </p>
    </div>
  );
}

function Score({
  label,
  value,
  competition,
}: {
  label: string;
  value: number;
  competition?: boolean;
}) {
  const cls = competition ? competitionHueClass(value) : scoreHueClass(value);
  return (
    <div className="rounded-xl border bg-muted/20 p-4">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-semibold tabular-nums ${cls}`}>{value}</div>
    </div>
  );
}

function MetricTile({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-semibold tabular-nums">{value}</div>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <tr>
      <td className="py-2 pr-4 text-muted-foreground">{k}</td>
      <td className="py-2 text-right font-medium tabular-nums">{v}</td>
    </tr>
  );
}
