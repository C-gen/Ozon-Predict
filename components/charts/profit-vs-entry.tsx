"use client";

import {
  ResponsiveContainer,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Scatter,
  ZAxis,
} from "recharts";
import type { ChartModels } from "@/services/analysis/types";
import { CHART_COLORS } from "./chart-theme";

function ProfitTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { name: string; profitScore: number; entryDifficulty: number } }>;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  return (
    <div className="rounded-md border bg-background/95 px-3 py-2 text-xs shadow-sm">
      <div className="font-semibold text-foreground">{point.name}</div>
      <div className="mt-1 text-muted-foreground">Score прибыли: {point.profitScore}</div>
      <div className="text-muted-foreground">Сложность входа: {point.entryDifficulty}</div>
    </div>
  );
}

export function ProfitVsEntryChart({
  data,
}: {
  data: ChartModels["profitVsEntryDifficulty"];
}) {
  if (!data.length) {
    return (
      <div className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">
        Нет данных для графика.
      </div>
    );
  }

  return (
    <div className="h-[340px] w-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 14, bottom: 30, left: 4 }}>
          <CartesianGrid strokeDasharray="4 4" stroke={CHART_COLORS.grid} />
          <XAxis
            type="number"
            dataKey="entryDifficulty"
            name="Сложность входа"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
            tickFormatter={(v) => `${v}`}
            label={{
              value: "Сложность входа",
              position: "bottom",
              offset: 0,
              fontSize: 11,
              fill: CHART_COLORS.muted,
            }}
          />
          <YAxis
            type="number"
            dataKey="profitScore"
            name="Score прибыли"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
            tickFormatter={(v) => `${v}`}
            label={{
              value: "Score прибыли",
              angle: -90,
              position: "insideLeft",
              fontSize: 11,
              fill: CHART_COLORS.muted,
            }}
          />
          <ZAxis range={[64, 64]} />
          <Tooltip
            content={<ProfitTooltip />}
          />
          <Scatter data={data} fill={CHART_COLORS.secondary} fillOpacity={0.85} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
