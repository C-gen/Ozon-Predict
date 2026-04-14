"use client";

import { cn } from "@/lib/utils";
import { competitionHueClass, scoreHueClass } from "@/utils/format";

export type ScoreBlockType = "overall" | "profit" | "demand" | "competition" | "growth";

export interface ScoreBlockProps {
  label: string;
  value: number;
  type: ScoreBlockType;
  highlight?: boolean;
  hint?: string;
  compact?: boolean;
  className?: string;
}

function hueForType(type: ScoreBlockType, value: number): string {
  if (type === "competition") return competitionHueClass(value);
  return scoreHueClass(value);
}

function barBgForType(type: ScoreBlockType, value: number): string {
  if (type === "competition") {
    if (value <= 40) return "bg-emerald-500/90";
    if (value <= 60) return "bg-amber-500/90";
    return "bg-rose-500/90";
  }
  if (value >= 78) return "bg-emerald-500/90";
  if (value >= 62) return "bg-sky-500/90";
  if (value >= 45) return "bg-amber-500/90";
  return "bg-rose-500/90";
}

/** Фиксированные зоны: подпись / значение / шкала — одинаковая геометрия во всех ячейках. */
export function ScoreBlock({
  label,
  value,
  type,
  highlight = false,
  hint,
  compact = false,
  className,
}: ScoreBlockProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const hue = hueForType(type, value);
  const barClass = barBgForType(type, value);

  return (
    <div
      title={hint}
      className={cn(
        "flex h-full w-full min-w-0 flex-col rounded-md border bg-card transition-colors duration-150",
        "min-h-[6.5rem] p-3 md:min-h-[6.75rem]",
        highlight
          ? "border-primary/40 bg-primary/[0.05] ring-1 ring-primary/10"
          : "border-border/70 hover:border-border hover:bg-muted/20",
        className,
      )}
    >
      <div className="flex min-h-[2.125rem] shrink-0 flex-col justify-end">
        <p className="line-clamp-2 text-left text-[11px] font-medium leading-snug text-muted-foreground">{label}</p>
      </div>

      <div className="flex min-h-[2.25rem] flex-1 items-center">
        <span
          className={cn(
            "tabular-nums tracking-tight",
            compact ? "text-xl leading-none" : "text-2xl leading-none",
            highlight ? "font-bold" : "font-semibold",
            hue,
          )}
        >
          {value}
        </span>
      </div>

      <div className="mt-auto h-1 w-full shrink-0 rounded-full bg-muted" aria-hidden>
        <div
          className={cn("h-full rounded-full transition-[width] duration-500 ease-out", barClass)}
          style={{ width: `${clamped}%` }}
        />
      </div>

      {hint ? <span className="sr-only">{hint}</span> : null}
    </div>
  );
}
