"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { EnrichedNiche } from "@/services/analysis/types";
import { CHART_COLORS } from "./chart-theme";

export function CompareScoresBar({ niches }: { niches: EnrichedNiche[] }) {
  const data = niches.map((n) => ({
    name: n.facts.name.length > 22 ? `${n.facts.name.slice(0, 20)}…` : n.facts.name,
    fullName: n.facts.name,
    overall: n.overallScore,
    profit: n.profitScore,
    demand: n.demandScore,
    competition: n.competitionScore,
  }));

  return (
    <div className="h-[240px] w-full min-w-0 overflow-x-auto sm:h-[280px] sm:overflow-visible">
      <div className="h-full min-w-[300px] sm:min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, left: -12, bottom: 32 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              interval={0}
              angle={-12}
              textAnchor="end"
              height={48}
            />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} width={32} />
            <Tooltip
              formatter={(value) => [Number(value ?? 0), ""]}
              labelFormatter={(_, p) => (p?.[0]?.payload as { fullName?: string })?.fullName ?? ""}
            />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
            <Bar dataKey="overall" name="Общий score" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" name="Score прибыли" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} />
            <Bar dataKey="demand" name="Score спроса" fill={CHART_COLORS.positive} radius={[4, 4, 0, 0]} />
            <Bar dataKey="competition" name="Score конкуренции" fill={CHART_COLORS.warning} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
