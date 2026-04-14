import type { NicheFacts } from "@/domain/niche/types";
import type { UserGoals } from "@/types/goals";

export function hasPreferredCategory(goals: UserGoals, category: string): boolean {
  if (!goals.preferredCategories.length) return false;
  const c = category.toLowerCase();
  return goals.preferredCategories.some((x) => x.toLowerCase() === c);
}

export function isExcludedCategory(goals: UserGoals, category: string): boolean {
  const c = category.toLowerCase();
  return goals.excludedCategories.some((x) => x.toLowerCase() === c);
}

export function filterExcluded(goals: UserGoals, facts: NicheFacts): boolean {
  return !isExcludedCategory(goals, facts.category);
}
