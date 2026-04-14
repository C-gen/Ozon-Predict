/**
 * Canonical MVP folder layout (modular monolith).
 * Keep in sync when adding modules.
 */
export const PROJECT_FOLDER_TREE = `
.
├── api/                      # HTTP contracts (this folder); handlers in app/api/
├── app/                      # Next.js App Router (pages, layouts, API routes)
│   └── api/                  # analyze, simulate, compare, niches, recommendations
├── components/               # Reusable UI (charts, layout, niche widgets, shadcn/ui)
├── data/                     # Seed files + repository implementations
│   └── niches/
│       ├── niches.seed.json  # Authoritative demo dataset (JSON)
│       ├── load-seed.ts      # Load + validate JSON → NicheFacts[]
│       ├── niche-seeds.ts    # Re-export for modules that import NICHE_SEEDS
│       └── repository.ts     # listNiches / getNicheById boundary
├── domain/                   # Pure domain logic (no React)
│   ├── niche/                # Types, validation, mappers
│   ├── scoring/              # Engine: helpers, formulas, engine, service shim
│   ├── recommendation/
│   ├── forecast/
│   ├── explanation/
│   ├── simulation/
│   └── auth/
├── features/                 # Route-facing feature slices (forms, dashboard view)
├── lib/                      # Config, validation, normalization, utils
├── services/                 # Application orchestration (analysis, compare)
├── store/                    # Client state (Zustand)
├── types/                    # Cross-cutting TS types (goals, API DTOs)
└── utils/                    # Formatting helpers
`.trim();
