# Ozon Niche Lab (MVP)

Production-style MVP for marketplace sellers (Ozon-first positioning): capture business goals, score niches with a transparent model, forecast revenue/profit/payback heuristically, and explain recommendations — all on **demo data** with a clean path to PostgreSQL + external APIs + ML services later.

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

- **Landing** (`/`) — value proposition + live sample cards (same scoring pipeline as the app).
- **Goals** (`/onboarding`) — target revenue/profit, horizon, budget, risk, categories, logistics, experience, payback.
- **Dashboard** (`/dashboard`) — ranked niches, charts, what-if simulator, compare picker.
- **Niche details** (`/niches/[id]`) — full score breakdown, radar, risks, launch notes.
- **Compare** (`/compare`) — table for 2–4 selected niches.

## Stack

- Next.js 14 (App Router) + TypeScript (strict)
- Tailwind CSS + shadcn/ui + Recharts
- Zustand for lightweight client state (goals + last analysis + compare selection)

## Client state and goal drift

The UI stores `goals`, the last **`analysis`** from `POST /api/analyze`, and an **`analysisGoalsFingerprint`** (stable hash of `goals` from `utils/goals-fingerprint.ts`).

- After you change goals in **Goals** or the dashboard **what-if** simulator, `setAnalysis(analysis, goalsFingerprint(goals))` keeps the dashboard and niche detail in sync with the fingerprint.
- If the fingerprint no longer matches (e.g. you edited goals but did not re-run analyze), the dashboard automatically refetches `/api/analyze`. Niche detail uses the same fingerprint rule and refetches when needed; **prev/next by rank** use a short-lived snapshot from the latest analyze response so navigation matches current goals even before the global store is refreshed.

Compare selection (`selectedCompareIds`, max 4) is independent and syncs with **Add to compare** on niche cards.

## API routes

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/analyze` | Body `{ goals }` → full `analysis` (ranked niches, chart models, KPI copy). Primary payload for the dashboard. |
| `POST` | `/api/recommendations` | Body `{ goals? }` (optional; defaults to demo goals) → `{ goals, generatedAt, recommendations, top }` — full ranked list and top slice **without** heavy chart payloads. Useful for integrations or lightweight previews. |
| `GET` | `/api/niches` | Raw demo niche facts (seed list). |
| `GET` | `/api/niches/[id]` | Single enriched niche for current/default goals. |
| `POST` | `/api/compare` | Body `{ nicheIds: string[], goals }` → `{ niches }`. Validates count (2–4), unknown IDs, and availability. Errors return `{ error, code }`. |
| `POST` | `/api/simulate` | Body `{ goals }` → `{ goals, analysis }` (what-if refresh). |

Shared DTOs live in `types/api.ts` and `api/contracts.ts`.

## Architecture (modular monolith)

- **`data/niches/`** — `niches.seed.json` loaded via `load-seed.ts`, exported through `niche-seeds.ts` and `repository.ts`. Replace with SQL/API without touching UI.
- **`domain/`** — pure business modules: `niche`, `scoring`, `recommendation`, `forecast`, `explanation`, `simulation`, `auth` (mock).
- **`services/analysis/`** — orchestrates domain services for dashboard payloads.
- **`lib/config/`** — scoring weights (`scoring.ts`) + business knobs (`business-rules.ts`).
- **`lib/normalization/`** — 0–100 normalization helpers.
- **`utils/format.ts`** — money / percent / score color helpers.

### Scoring weights

Edit `lib/config/scoring.ts` for pillar blends and overall weights:

`Overall = Demand*0.30 + Profit*0.30 + (100−Competition)*0.25 + Growth*0.10 + Entry*0.05`

**Competition Score** is defined so that **higher = worse competition**.

### Extending demo data

1. Edit `data/niches/niches.seed.json` (or the generated export in `niche-seeds.ts` if you maintain TypeScript seeds).
2. Each item must satisfy `NicheFacts` in `domain/niche/types.ts`.
3. Categories for onboarding filters are derived from seeds in `lib/categories.ts`.
4. Run `npm run build` to validate types.

Keep numbers internally consistent (price, cost, commission, returns, demand, seller counts) so scores stay believable.

## Production evolution

- Swap `data/niches/repository.ts` for a DB-backed implementation.
- Replace `domain/forecast/service.ts` internals with model outputs (keep the interface).
- Wire `domain/auth/service.ts` to your identity provider.
- Move `BUSINESS_RULES` and scoring coefficients to remote config for ops/admin.

## Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint
