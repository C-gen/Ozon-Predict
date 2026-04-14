"use client";

import { NicheCard } from "@/components/niche/niche-card";
import type { EnrichedNiche } from "@/services/analysis/types";

export function LandingRecommendations({ niches }: { niches: EnrichedNiche[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {niches.map((n) => (
        <NicheCard key={n.facts.id} niche={n} showCompareActions={false} />
      ))}
    </div>
  );
}
