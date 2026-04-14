"use client";

import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";
import { CHART_COLORS } from "./chart-theme";

export function RadarScoreProfile({
  demand,
  profit,
  competition,
  growth,
  entry,
}: {
  demand: number;
  profit: number;
  competition: number;
  growth: number;
  entry: number;
}) {
  const competitionEase = Math.max(0, Math.min(100, 100 - competition));
  const data = [
    { axis: "Спрос", value: demand },
    { axis: "Прибыль", value: profit },
    { axis: "Лёгкость конкуренции", value: competitionEase },
    { axis: "Рост", value: growth },
    { axis: "Лёгкость входа", value: entry },
  ];

  return (
    <div className="h-[320px] w-full min-h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
          <PolarGrid stroke={CHART_COLORS.grid} />
          <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: CHART_COLORS.muted }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: CHART_COLORS.muted }} />
          <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
          <Radar
            name="Профиль"
            dataKey="value"
            stroke={CHART_COLORS.primary}
            fill={CHART_COLORS.primary}
            fillOpacity={0.28}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
