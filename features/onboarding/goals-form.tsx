"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { UserGoals } from "@/types/goals";
import { useAppStore } from "@/store/useAppStore";
import { CATEGORY_OPTIONS } from "@/lib/categories";
import { goalsFingerprint } from "@/utils/goals-fingerprint";
import {
  experienceLabelRu,
  horizonLabelRu,
  logisticsLabelRu,
  riskLabelRu,
  ru,
} from "@/lib/i18n/ru";

function toggleInList(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
}

export function GoalsForm({ initial }: { initial?: UserGoals }) {
  const router = useRouter();
  const setGoals = useAppStore((s) => s.setGoals);
  const setAnalysis = useAppStore((s) => s.setAnalysis);

  const base = initial ?? useAppStore.getState().goals;

  const [targetRevenueRub, setTargetRevenueRub] = useState(base.targetRevenueRub);
  const [targetProfitRub, setTargetProfitRub] = useState(base.targetProfitRub);
  const [timeHorizonMonths, setTimeHorizonMonths] = useState(base.timeHorizonMonths);
  const [availableBudgetRub, setAvailableBudgetRub] = useState(base.availableBudgetRub);
  const [riskTolerance, setRiskTolerance] = useState(base.riskTolerance);
  const [preferredCategories, setPreferredCategories] = useState<string[]>(
    base.preferredCategories,
  );
  const [excludedCategories, setExcludedCategories] = useState<string[]>(
    base.excludedCategories,
  );
  const [logisticsCapability, setLogisticsCapability] = useState(base.logisticsCapability);
  const [experienceLevel, setExperienceLevel] = useState(base.experienceLevel);
  const [desiredPaybackMonths, setDesiredPaybackMonths] = useState(base.desiredPaybackMonths);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goalsPayload: UserGoals = useMemo(
    () => ({
      targetRevenueRub,
      targetProfitRub,
      timeHorizonMonths,
      availableBudgetRub,
      riskTolerance,
      preferredCategories,
      excludedCategories,
      logisticsCapability,
      experienceLevel,
      desiredPaybackMonths,
    }),
    [
      targetRevenueRub,
      targetProfitRub,
      timeHorizonMonths,
      availableBudgetRub,
      riskTolerance,
      preferredCategories,
      excludedCategories,
      logisticsCapability,
      experienceLevel,
      desiredPaybackMonths,
    ],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Бизнес-цели</CardTitle>
        <p className="text-sm text-muted-foreground">
          Цели превращаются в корректировки скоринга — слабая юнит-экономика по-прежнему отсекается
          моделью.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Целевая выручка (₽)</Label>
            <Input
              inputMode="numeric"
              value={String(targetRevenueRub)}
              onChange={(e) => setTargetRevenueRub(Number(e.target.value || 0))}
            />
          </div>
          <div className="space-y-2">
            <Label>Целевая прибыль (₽)</Label>
            <Input
              inputMode="numeric"
              value={String(targetProfitRub)}
              onChange={(e) => setTargetProfitRub(Number(e.target.value || 0))}
            />
          </div>
          <div className="space-y-2">
            <Label>Горизонт планирования</Label>
            <Select
              value={String(timeHorizonMonths)}
              onValueChange={(v) =>
                setTimeHorizonMonths(Number(v) as UserGoals["timeHorizonMonths"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">{horizonLabelRu(1)}</SelectItem>
                <SelectItem value="3">{horizonLabelRu(3)}</SelectItem>
                <SelectItem value="6">{horizonLabelRu(6)}</SelectItem>
                <SelectItem value="12">{horizonLabelRu(12)}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Стартовый бюджет (₽)</Label>
            <Input
              inputMode="numeric"
              value={String(availableBudgetRub)}
              onChange={(e) => setAvailableBudgetRub(Number(e.target.value || 0))}
            />
          </div>
          <div className="space-y-2">
            <Label>Допустимый риск</Label>
            <Select
              value={riskTolerance}
              onValueChange={(v) => setRiskTolerance(v as UserGoals["riskTolerance"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{riskLabelRu("low")}</SelectItem>
                <SelectItem value="medium">{riskLabelRu("medium")}</SelectItem>
                <SelectItem value="high">{riskLabelRu("high")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Уровень опыта</Label>
            <Select
              value={experienceLevel}
              onValueChange={(v) => setExperienceLevel(v as UserGoals["experienceLevel"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">{experienceLabelRu("beginner")}</SelectItem>
                <SelectItem value="intermediate">{experienceLabelRu("intermediate")}</SelectItem>
                <SelectItem value="advanced">{experienceLabelRu("advanced")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Желаемый срок окупаемости (мес.)</Label>
            <Input
              inputMode="numeric"
              value={String(desiredPaybackMonths)}
              onChange={(e) => setDesiredPaybackMonths(Number(e.target.value || 0))}
            />
          </div>
          <div className="space-y-2">
            <Label>Логистическая модель</Label>
            <Select
              value={logisticsCapability}
              onValueChange={(v) =>
                setLogisticsCapability(v as UserGoals["logisticsCapability"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fbu">{logisticsLabelRu("fbu")}</SelectItem>
                <SelectItem value="fbs">{logisticsLabelRu("fbs")}</SelectItem>
                <SelectItem value="mixed">{logisticsLabelRu("mixed")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div>
            <Label>Предпочтительные категории</Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Небольшой бонус к рангу — не спасёт слабую экономику карточки.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((c) => {
              const active = preferredCategories.includes(c);
              return (
                <Badge
                  key={`p-${c}`}
                  variant={active ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setPreferredCategories((prev) => toggleInList(prev, c))}
                >
                  {c}
                </Badge>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Исключённые категории</Label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((c) => {
              const active = excludedCategories.includes(c);
              return (
                <Badge
                  key={`e-${c}`}
                  variant={active ? "destructive" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setExcludedCategories((prev) => toggleInList(prev, c))}
                >
                  {c}
                </Badge>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Заметки (по желанию)</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ограничения, сильные стороны закупки, позиционирование бренда…"
          />
        </div>

        {error ? <div className="text-sm text-destructive">{error}</div> : null}

        <div className="flex flex-wrap gap-2">
          <Button
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              setError(null);
              try {
                setGoals(goalsPayload);
                const res = await fetch("/api/analyze", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ goals: goalsPayload }),
                });
                if (!res.ok) throw new Error(ru.errors.analysisRun);
                const json = await res.json();
                setAnalysis(json.analysis, goalsFingerprint(goalsPayload));
                router.push("/dashboard");
              } catch {
                setError(ru.errors.analysisRun);
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? ru.actions.runningAnalysis : ru.actions.generateDashboard}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
            {ru.actions.skipToDashboard}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
