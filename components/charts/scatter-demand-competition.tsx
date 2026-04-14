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

function ScatterTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { name: string; demandScore: number; competitionScore: number } }>;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  return (
    <div className="rounded-md border bg-background/95 px-3 py-2 text-xs shadow-sm">
      <div className="font-semibold text-foreground">{point.name}</div>
      <div className="mt-1 text-muted-foreground">Спрос: {point.demandScore}</div>
      <div className="text-muted-foreground">Конкуренция: {point.competitionScore}</div>
    </div>
  );
}

export function ScatterDemandCompetition({
  data,
}: {
  data: ChartModels["scatterDemandVsCompetition"];
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
            dataKey="competitionScore"
            name="Score конкуренции"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
            tickFormatter={(v) => `${v}`}
            label={{
              value: "Score конкуренции (выше — жёстче)",
              position: "bottom",
              offset: 0,
              fontSize: 10,
              fill: CHART_COLORS.muted,
            }}
          />
          <YAxis
            type="number"
            dataKey="demandScore"
            name="Score спроса"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
            tickFormatter={(v) => `${v}`}
            label={{
              value: "Score спроса",
              angle: -90,
              position: "insideLeft",
              fontSize: 10,
              fill: CHART_COLORS.muted,
            }}
          />
          <ZAxis range={[64, 64]} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3", stroke: CHART_COLORS.muted }}
            content={<ScatterTooltip />}
          />
          <Scatter data={data} fill={CHART_COLORS.primary} fillOpacity={0.82} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
