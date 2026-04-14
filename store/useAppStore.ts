"use client";

import { create } from "zustand";
import { DEFAULT_GOALS, type UserGoals } from "@/types/goals";
import type { AnalysisResult } from "@/services/analysis/types";

interface AppState {
  goals: UserGoals;
  analysis: AnalysisResult | null;
  /** Fingerprint of `goals` used to produce `analysis` (see `goalsFingerprint`). */
  analysisGoalsFingerprint: string | null;
  selectedCompareIds: string[];
  setGoals: (goals: UserGoals) => void;
  setAnalysis: (analysis: AnalysisResult | null, fingerprint?: string | null) => void;
  toggleCompareId: (id: string) => void;
  clearCompare: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  goals: DEFAULT_GOALS,
  analysis: null,
  analysisGoalsFingerprint: null,
  selectedCompareIds: [],
  setGoals: (goals) => set({ goals }),
  setAnalysis: (analysis, fingerprint = null) =>
    set({
      analysis,
      analysisGoalsFingerprint: analysis ? fingerprint : null,
    }),
  toggleCompareId: (id) => {
    const cur = get().selectedCompareIds;
    const has = cur.includes(id);
    let next = has ? cur.filter((x) => x !== id) : [...cur, id];
    if (next.length > 4) next = next.slice(next.length - 4, next.length);
    set({ selectedCompareIds: next });
  },
  clearCompare: () => set({ selectedCompareIds: [] }),
}));
