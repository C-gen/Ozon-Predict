"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { ChartModels } from "@/services/analysis/types";
import { CHART_COLORS } from "./chart-theme";

function LeaderboardTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-background/95 px-3 py-2 text-xs shadow-sm">
      <div className="font-semibold text-foreground">{label}</div>
      <div className="mt-1 text-muted-foreground">Общий score: {Number(payload[0]?.value ?? 0)}</div>
    </div>
  );
}

export function LeaderboardBar({ data }: { data: ChartModels["leaderboard"] }) {
  if (!data.length) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
        Нет данных рейтинга.
      </div>
    );
  }

  return (
    <div className="h-[340px] w-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 2, bottom: 8 }} barCategoryGap={12}>
          <CartesianGrid strokeDasharray="4 4" stroke={CHART_COLORS.grid} horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
            tickFormatter={(v) => `${v}`}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={170}
            tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
            tickFormatter={(value: string) =>
              value.length > 24 ? `${value.slice(0, 22).trimEnd()}…` : value
            }
          />
          <Tooltip content={<LeaderboardTooltip />} />
          <Bar dataKey="overallScore" name="Общий score" fill={CHART_COLORS.primary} radius={[0, 7, 7, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
