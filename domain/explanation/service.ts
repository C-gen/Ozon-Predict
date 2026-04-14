import type { NicheFacts } from "@/domain/niche/types";
import type { NicheScores } from "@/domain/scoring/types";
import type { UserGoals } from "@/types/goals";
import type { NicheForecast } from "@/domain/forecast/types";
import type { PersonalizationMeta } from "@/domain/recommendation/types";

/**
 * Human-readable reasons for UI explainability cards.
 */
export function buildRecommendationReasons(input: {
  facts: NicheFacts;
  scores: NicheScores;
  goals: UserGoals;
  forecast: NicheForecast;
  personalization: PersonalizationMeta;
}): string[] {
  const { facts, scores, goals, forecast, personalization } = input;
  const reasons: string[] = [];

  if (facts.demandGrowthRate > 0.12) {
    reasons.push("Спрос растёт устойчиво выше среднего по каталогу.");
  } else if (facts.demandGrowthRate > 0.04) {
    reasons.push("Спрос растёт умеренно — ниша в фазе мягкого расширения.");
  }

  if (scores.competitionScore < 45) {
    reasons.push("Конкуренция относительно мягкая для смежных подкатегорий.");
  } else if (scores.competitionScore < 65) {
    reasons.push("Конкуренция умеренная: есть окно для дифференциации.");
  } else {
    reasons.push("Конкуренция высокая — критичны УТП, медиа и операционная дисциплина.");
  }

  if (goals.availableBudgetRub >= facts.estimatedStartupBudgetRub * 1.05) {
    reasons.push("Стартовый бюджет закрывает типовой порог входа по запасам и настройке.");
  } else {
    reasons.push("Бюджет близок к порогу входа — стоит планировать поэтапный запуск.");
  }

  if (
    forecast.estimatedPaybackMonths !== null &&
    forecast.estimatedPaybackMonths <= goals.desiredPaybackMonths
  ) {
    reasons.push("Оценочный срок окупаемости укладывается в ваш целевой горизонт.");
  } else if (forecast.estimatedPaybackMonths !== null) {
    reasons.push("Окупаемость может выйти за целевой срок при консервативной доле рынка.");
  }

  if (goals.experienceLevel === "beginner" && facts.operationalComplexity <= 3) {
    reasons.push("Операционная сложность укладывается в профиль «новичок».");
  }

  if (goals.experienceLevel === "advanced" && scores.growthScore > 70) {
    reasons.push("Высокий потенциал роста — логично усилить закупку и рекламные эксперименты.");
  }

  if (personalization.fitLabel === "strong") {
    reasons.push("Сводный профиль риска/доходности близок к оптимальному для ваших целей.");
  }

  if (facts.emergingNicheSignal > 0.55) {
    reasons.push("Есть признаки «ранней» ниши: концентрация лидеров ещё не зацементирована.");
  }

  return reasons.slice(0, 6);
}
