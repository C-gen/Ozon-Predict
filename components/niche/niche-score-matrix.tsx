"use client";

import { cn } from "@/lib/utils";
import { ru } from "@/lib/i18n/ru";
import { ScoreBlock } from "@/components/niche/score-block";

const MATRIX_GAP = "gap-2 md:gap-2.5 lg:gap-3";

type MatrixProps = {
  overallScore: number;
  profitScore: number;
  demandScore: number;
  competitionScore: number;
  growthScore: number;
  compact?: boolean;
};

/** Строгая сетка 2×2 + отдельная полоса роста; одинаковые ячейки и отступы. */
export function NicheScoreMatrix({
  overallScore,
  profitScore,
  demandScore,
  competitionScore,
  growthScore,
  compact = false,
}: MatrixProps) {
  const overallHint = compact
    ? ru.scores.explain.overall
    : `${ru.scores.explain.overall} ${ru.scores.coreModelHint}`;
  const competitionHint = `${ru.scores.explain.competition} ${ru.scores.competitionHigherTougher}`;

  return (
    <div className={cn("flex min-w-0 flex-col", MATRIX_GAP)}>
      <div
        className={cn(
          "grid w-full min-w-0 shrink-0 grid-cols-1",
          MATRIX_GAP,
          "md:grid-cols-2 md:[grid-template-columns:minmax(0,1fr)_minmax(0,1fr)]",
        )}
      >
        <ScoreBlock
          label={ru.scores.overall}
          value={overallScore}
          type="overall"
          highlight
          compact={compact}
          hint={overallHint}
        />
        <ScoreBlock label={ru.scores.profit} value={profitScore} type="profit" compact={compact} hint={ru.scores.explain.profit} />
        <ScoreBlock label={ru.scores.demand} value={demandScore} type="demand" compact={compact} hint={ru.scores.explain.demand} />
        <ScoreBlock
          label={ru.scores.competition}
          value={competitionScore}
          type="competition"
          compact={compact}
          hint={competitionHint}
        />
      </div>
      <div className="min-w-0 shrink-0">
        <ScoreBlock
          label={ru.scores.growth}
          value={growthScore}
          type="growth"
          compact={compact}
          hint={ru.scores.explain.growth}
        />
      </div>
    </div>
  );
}
