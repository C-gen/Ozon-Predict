"use client";

import { Badge } from "@/components/ui/badge";
import type { UserGoals } from "@/types/goals";
import { formatMoneyRub } from "@/utils/format";
import {
  experienceLabelRu,
  horizonLabelRu,
  riskLabelRu,
} from "@/lib/i18n/ru";

function compactCategoryList(items: string[]): string {
  if (items.length <= 2) return items.join(", ");
  return `${items.slice(0, 2).join(", ")} +${items.length - 2}`;
}

export function GoalSummaryStrip({ goals }: { goals: UserGoals }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      <Badge variant="secondary" className="font-normal">
        Горизонт: {horizonLabelRu(goals.timeHorizonMonths)}
      </Badge>
      <Badge variant="outline" className="font-normal">
        Бюджет {formatMoneyRub(goals.availableBudgetRub)}
      </Badge>
      <Badge variant="outline" className="font-normal">
        Риск: {riskLabelRu(goals.riskTolerance)}
      </Badge>
      <Badge variant="outline" className="font-normal">
        Опыт: {experienceLabelRu(goals.experienceLevel)}
      </Badge>
      <Badge variant="outline" className="font-normal">
        Окупаемость ≤ {goals.desiredPaybackMonths} мес.
      </Badge>
      {goals.preferredCategories.length ? (
        <Badge
          variant="default"
          className="max-w-[320px] whitespace-normal break-words text-left leading-snug font-normal"
          title={goals.preferredCategories.join(", ")}
        >
          Приоритетные категории: {compactCategoryList(goals.preferredCategories)}
        </Badge>
      ) : null}
      {goals.excludedCategories.length ? (
        <Badge
          variant="destructive"
          className="max-w-[320px] whitespace-normal break-words text-left leading-snug font-normal"
          title={goals.excludedCategories.join(", ")}
        >
          Исключённые категории: {compactCategoryList(goals.excludedCategories)}
        </Badge>
      ) : null}
    </div>
  );
}
