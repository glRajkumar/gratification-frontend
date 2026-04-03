# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server on port 3000
pnpm build        # Production build
pnpm preview      # Preview production build
pnpm typecheck    # TypeScript validation (no emit)
```

## Architecture

This is a **TanStack Start** full-stack React app (React 19, TypeScript 6, Vite 8).

### Routing

File-based routing via TanStack Router. Routes live in `src/routes/`:
- `__root.tsx` — root layout, sets up HTML, global styles, devtools
- `index.tsx` — home page
- Route tree is auto-generated into `src/routeTree.gen.ts` — do not edit manually

New routes: create files in `src/routes/`. TanStack Router will auto-generate the tree on next dev run.

### API Call Flow

Follow the three-layer pattern from the global rules:
```
src/services/  →  src/actions/  →  src/hooks/
(axios)           (API fns)        (React Query)
```

TanStack Query and Zustand are not yet installed — add them when needed. Do **not** bypass the layered pattern by calling axios directly from components.

### State

- Server/async data → TanStack Query hooks (`src/hooks/`)
- UI-only state → Zustand stores (`src/store/`)

### UI Components

`src/components/ui/` contains 27 shadcn/ui components built on **Base UI** (not Radix). When adding new shadcn components, ensure they target Base UI primitives per `components.json`.

Key utilities in `src/lib/utils.ts`:
- `cn()` — class name merger (clsx + tailwind-merge)
- Option/group/separator type guards: `isOption`, `isGroup`, `isSeparator`
- Shared types for select/combobox options in `src/types/general.d.ts`

### Forms

Use react-hook-form + Zod resolver. `src/components/ui/field-wrapper-rhf.tsx` provides the standard field wrapper for RHF-connected fields. Define Zod schemas in `src/utils/`, infer types from them.

### Styling

Tailwind CSS v4 — configured via `@import "@tailwindcss"` in `src/styles.css`. Theme tokens (colors, radius, fonts) are CSS variables defined there. Use `cn()` for conditional classes.
