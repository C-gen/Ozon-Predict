import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { runAnalysis } from "@/services/analysis/runAnalysis";
import { DEFAULT_GOALS } from "@/types/goals";
import { LandingRecommendations } from "@/features/landing/landing-recommendations";
import { HeroBenefits } from "@/features/landing/hero-benefits";
import { ru } from "@/lib/i18n/ru";

export default function HomePage() {
  const preview = runAnalysis(DEFAULT_GOALS).top.slice(0, 3);

  return (
    <div className="min-h-dvh bg-gradient-to-b from-background to-muted/40">
      <header className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <Link
          href="/"
          className="flex w-fit items-center gap-2 rounded-md p-1 -m-1 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">{ru.brand.title}</div>
            <div className="text-xs text-muted-foreground">{ru.brand.taglineLanding}</div>
          </div>
        </Link>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:justify-end">
          <Button asChild variant="ghost" className="w-full sm:w-auto">
            <Link href="/dashboard">{ru.actions.liveDashboard}</Link>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/onboarding">{ru.actions.startAnalysis}</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-14 px-4 pb-16 pt-6">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
              Для продавцов маркетплейсов
            </div>
            <div className="space-y-4">
              <h1 className="max-w-2xl text-pretty text-4xl font-bold tracking-tight md:text-5xl lg:text-[3.35rem] lg:leading-[1.05]">
                Понимайте, где деньги — до того, как зайдёте в нишу
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Получайте рекомендации по нишам с прогнозом выручки, прибыли и окупаемости на
                основе аналитики рынка.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href="/dashboard">
                  Посмотреть рекомендации <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/onboarding">Начать анализ</Link>
              </Button>
            </div>
          </div>
          <Card className="overflow-hidden border-muted-foreground/15 bg-gradient-to-b from-card to-muted/30 shadow-sm">
            <CardContent className="space-y-5 p-6">
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Превью дашборда
                </div>
                <div className="text-lg font-semibold">Ключевые сигналы по нишам за один экран</div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <PreviewMetric label="Общий score" value="82" tone="text-emerald-600" />
                <PreviewMetric label="Score прибыли" value="76" tone="text-sky-600" />
                <PreviewMetric label="Score спроса" value="71" tone="text-sky-600" />
                <PreviewMetric label="Score конкуренции" value="48" tone="text-amber-600" />
              </div>
              <div className="space-y-2 rounded-lg border bg-background/70 p-3">
                <div className="text-xs font-medium text-muted-foreground">Потенциал ниши (демо)</div>
                <div className="space-y-2.5">
                  <PreviewBar label="Коврик под миски" width="82%" />
                  <PreviewBar label="Органайзер для дома" width="74%" />
                  <PreviewBar label="Увлажнитель воздуха" width="68%" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <HeroBenefits />

        <section className="space-y-4">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Пример рекомендаций</h2>
              <p className="text-sm text-muted-foreground">
                Те же карточки, что на дашборде — демо-набор и цели по умолчанию.
              </p>
            </div>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/dashboard">
                {ru.actions.openDashboard} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <LandingRecommendations niches={preview} />
        </section>
      </main>
    </div>
  );
}

function PreviewMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-lg border bg-background/70 p-3">
      <div className="text-[11px] font-medium text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-semibold tabular-nums ${tone}`}>{value}</div>
    </div>
  );
}

function PreviewBar({ label, width }: { label: string; width: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="truncate text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums text-foreground">{width}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-gradient-to-r from-primary to-sky-500" style={{ width }} />
      </div>
    </div>
  );
}
