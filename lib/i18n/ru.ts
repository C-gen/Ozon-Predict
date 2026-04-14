/**
 * RU UI copy — нейтральный продуктовый тон для селлеров и категорийных.
 */

export const ru = {
  brand: {
    title: "Ozon Niche Lab",
    taglineWorkspace: "Решения по нишам",
    taglineLanding: "Аналитика для селлеров МП",
    headerSubtitle: "Скоринг, прогнозы и объяснения под ваши цели",
    badgeDataset: "Демо",
    demoAsideTitle: "Демо-режим",
    demoAsideBody: "Данные учебные — позже можно подключить выгрузки Ozon.",
    landingKicker: "Учебный стенд на демо-каталоге — готово к продакшен-данным",
  },
  nav: {
    dashboard: "Дашборд",
    goals: "Цели",
    compare: "Сравнение",
  },
  scores: {
    overall: "Общий score",
    profit: "Score прибыли",
    demand: "Score спроса",
    competition: "Score конкуренции",
    growth: "Score роста",
    entry: "Score входа",
    rank: "Ранг-score",
    coreModelHint: "Базовая модель",
    competitionHigherTougher: "Выше — жёстче рынок",
    /** Короткие подсказки для title / доступности. */
    explain: {
      overall:
        "Сводный score модели: спрос, прибыль, конкуренция, вход и динамика — в одном числе.",
      profit: "Оценка потенциала прибыли с учётом маржи и ожидаемого объёма.",
      demand: "Насколько стабилен и сильный спрос по нише относительно каталога.",
      competition: "Чем выше score, тем выше конкуренция — сложнее выделиться и масштабироваться.",
      growth: "Динамика ниши: тренд роста спроса и расширения сегмента.",
    },
  },
  forecast: {
    revenue: "Прогноз выручки",
    profit: "Прогноз прибыли",
    payback: "Окупаемость",
    perMonth: "/мес.",
    monthsShort: "мес.",
    na: "—",
  },
  fit: {
    strong: "Отличное совпадение",
    good: "Хорошее совпадение",
    cautious: "С оговорками",
  },
  risk: {
    low: "Низкий риск",
    medium: "Средний риск",
    high: "Высокий риск",
  },
  experience: {
    beginner: "Новичок",
    intermediate: "Средний уровень",
    advanced: "Опытный",
  },
  logistics: {
    fbu: "FBU — упор на склад",
    fbs: "FBS — отгрузка силами селлера",
    mixed: "Смешанная модель",
  },
  horizonMonths: {
    1: "1 месяц",
    3: "3 месяца",
    6: "6 месяцев",
    12: "12 месяцев",
  },
  actions: {
    analyze: "Проанализировать рынок",
    startAnalysis: "Начать анализ",
    viewDetails: "Подробнее",
    compare: "Сравнить",
    recalculate: "Пересчитать",
    refreshData: "Обновить",
    retry: "Повторить",
    back: "Назад",
    backToDashboard: "К дашборду",
    openCompare: "Сравнение ниш",
    clearAll: "Сбросить выбор",
    addToCompare: "В сравнение",
    inCompare: "В списке",
    editGoals: "Цели",
    skipToDashboard: "Без расчёта, в дашборд",
    generateDashboard: "Собрать дашборд",
    runningAnalysis: "Считаем…",
    refreshRecommendations: "Пересчитать",
    refreshing: "Обновляем…",
    liveDashboard: "Дашборд",
    viewSampleDashboard: "Пример дашборда",
    openDashboard: "Открыть дашборд",
  },
  errors: {
    generic: "Что-то пошло не так",
    requestFailed: "Запрос не выполнен",
    dashboardLoad: "Не удалось загрузить дашборд.",
    compareLoad: "Не удалось загрузить сравнение.",
    simulation: "Не удалось пересчитать. Попробуйте ещё раз.",
    analysisRun: "Не удалось запустить расчёт. Проверьте поля.",
    invalidJson: "Тело запроса не распознано",
    internal: "Сбой сервера",
    couldNotCompare: "Сравнение не удалось",
    codePrefix: "Код",
  },
  api: {
    compareNeedTwo: "Укажите минимум две ниши",
    compareIdsInvalid: "Нужно минимум два непустых идентификатора",
    nicheNotFound: "Ниша не найдена",
    invalidGoalsQuery: "Не удалось разобрать параметр goals",
    nicheExcludedByFilters: "Ниша скрыта фильтрами категорий",
  },
  rankingAdjustments: {
    summary: "Поправки к рангу",
    ruleOne: "правило",
    ruleMany: "правил",
    show: "Показать",
    hide: "Скрыть",
  },
} as const;

export function fitLabelRu(label: "strong" | "good" | "cautious"): string {
  return ru.fit[label];
}

export function riskLabelRu(label: "low" | "medium" | "high"): string {
  return ru.risk[label];
}

export function experienceLabelRu(level: "beginner" | "intermediate" | "advanced"): string {
  return ru.experience[level];
}

export function logisticsLabelRu(cap: "fbu" | "fbs" | "mixed"): string {
  return ru.logistics[cap];
}

export function horizonLabelRu(m: 1 | 3 | 6 | 12): string {
  return ru.horizonMonths[m];
}
