"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { ChartModels } from "@/services/analysis/types";
import { formatMoneyRub } from "@/utils/format";
import { CHART_COLORS } from "./chart-theme";

function ForecastTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number }>;
  label?: number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-background/95 px-3 py-2 text-xs shadow-sm">
      <div className="font-semibold text-foreground">Месяц {label}</div>
      {payload.map((row) => (
        <div key={row.name} className="mt-1 text-muted-foreground">
          {row.name}: {formatMoneyRub(Number(row.value ?? 0))}
        </div>
      ))}
    </div>
  );
}

export function ForecastLinesChart({
  data,
}: {
  data: ChartModels["forecastByHorizon"];
}) {
  if (!data.length) {
    return (
      <div className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">
        Нет точек прогноза.
      </div>
    );
  }

  return (
    <div className="h-[340px] w-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 14, left: 2, bottom: 12 }}>
          <CartesianGrid strokeDasharray="4 4" stroke={CHART_COLORS.grid} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
            tickFormatter={(v) => `${v}м`}
            label={{ value: "Горизонт", position: "insideBottom", offset: -8, fontSize: 10, fill: CHART_COLORS.muted }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
            width={56}
            tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
          />
          <Tooltip
            content={<ForecastTooltip />}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 6 }} />
          <Line
            type="monotone"
            dataKey="revenue"
            name="Выручка"
            stroke={CHART_COLORS.primary}
            strokeWidth={2.25}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="profit"
            name="Прибыль"
            stroke={CHART_COLORS.secondary}
            strokeWidth={2.25}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
