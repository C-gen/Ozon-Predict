/**
 * Explicit colors for Recharts (SVG does not always resolve `hsl(var(--primary))`).
 * Tune to match `app/globals.css` primary / chart tokens.
 */
export const CHART_COLORS = {
  primary: "hsl(222.2 47.4% 11.2%)",
  secondary: "hsl(160 60% 40%)",
  muted: "hsl(215.4 16.3% 46.9%)",
  grid: "hsl(214.3 31.8% 91.4%)",
  positive: "hsl(142 76% 36%)",
  warning: "hsl(38 92% 50%)",
} as const;
