"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { RiskTolerance, TimeHorizonMonths, UserGoals } from "@/types/goals";
import { useAppStore } from "@/store/useAppStore";
import type { AnalysisResult } from "@/services/analysis/types";
import { runAnalysis } from "@/services/analysis/runAnalysis";
import { CATEGORY_OPTIONS } from "@/lib/categories";
import { goalsFingerprint } from "@/utils/goals-fingerprint";
import {
  experienceLabelRu,
  horizonLabelRu,
  riskLabelRu,
  ru,
} from "@/lib/i18n/ru";

function toGoals(state: {
  targetRevenueRub: number;
  targetProfitRub: number;
  timeHorizonMonths: UserGoals["timeHorizonMonths"];
  availableBudgetRub: number;
  riskTolerance: UserGoals["riskTolerance"];
  desiredPaybackMonths: number;
  experienceLevel: UserGoals["experienceLevel"];
}): UserGoals {
  const base = useAppStore.getState().goals;
  return {
    ...base,
    ...state,
  };
}

export function ScenarioCalculator({
  onResult,
}: {
  onResult?: (analysis: AnalysisResult) => void;
}) {
  const goals = useAppStore((s) => s.goals);
  const setGoals = useAppStore((s) => s.setGoals);
  const setAnalysis = useAppStore((s) => s.setAnalysis);

  const [targetRevenueRub, setTargetRevenueRub] = useState(goals.targetRevenueRub);
  const [targetProfitRub, setTargetProfitRub] = useState(goals.targetProfitRub);
  const [timeHorizonMonths, setTimeHorizonMonths] = useState<TimeHorizonMonths>(
    goals.timeHorizonMonths,
  );
  const [availableBudgetRub, setAvailableBudgetRub] = useState(goals.availableBudgetRub);
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>(goals.riskTolerance);
  const [desiredPaybackMonths, setDesiredPaybackMonths] = useState(goals.desiredPaybackMonths);
  const [experienceLevel, setExperienceLevel] = useState(goals.experienceLevel);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const riskIndex =
    riskTolerance === "low" ? 0 : riskTolerance === "medium" ? 1 : 2;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Сценарное моделирование</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
            <Label>Доступный бюджет (₽)</Label>
            <Input
              inputMode="numeric"
              value={String(availableBudgetRub)}
              onChange={(e) => setAvailableBudgetRub(Number(e.target.value || 0))}
            />
          </div>
          <div className="space-y-2">
            <Label>Желаемая окупаемость (мес.)</Label>
            <Input
              inputMode="numeric"
              value={String(desiredPaybackMonths)}
              onChange={(e) => setDesiredPaybackMonths(Number(e.target.value || 0))}
            />
          </div>
          <div className="space-y-2">
            <Label>Горизонт планирования</Label>
            <Select
              value={String(timeHorizonMonths)}
              onValueChange={(v) => setTimeHorizonMonths(Number(v) as TimeHorizonMonths)}
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
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Допустимый риск</Label>
            <div className="text-xs text-muted-foreground">{riskLabelRu(riskTolerance)}</div>
          </div>
          <Slider
            value={[riskIndex]}
            min={0}
            max={2}
            step={1}
            onValueChange={(vals) => {
              const v = Array.isArray(vals) ? (vals[0] ?? 1) : vals;
              const map: RiskTolerance[] = ["low", "medium", "high"];
              setRiskTolerance(map[v] ?? "medium");
            }}
          />
        </div>

        {error ? <div className="text-sm text-destructive">{error}</div> : null}

        <Button
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            setError(null);
            try {
              const nextGoals = toGoals({
                targetRevenueRub,
                targetProfitRub,
                timeHorizonMonths,
                availableBudgetRub,
                riskTolerance,
                desiredPaybackMonths,
                experienceLevel,
              });
              setGoals(nextGoals);
              const analysis = runAnalysis(nextGoals);
              setAnalysis(analysis, goalsFingerprint(nextGoals));
              onResult?.(analysis);
            } catch {
              setError(ru.errors.simulation);
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? ru.actions.refreshing : ru.actions.refreshRecommendations}
        </Button>
        <div className="text-xs text-muted-foreground">
          Предпочтения и исключения категорий задаются на странице «Цели» (в демо —{" "}
          {CATEGORY_OPTIONS.length} категорий).
        </div>
      </CardContent>
    </Card>
  );
}
