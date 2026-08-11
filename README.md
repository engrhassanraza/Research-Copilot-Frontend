# Research-Copilot-Frontend

Next.js frontend for the AI Research Copilot. Talks to
[Research-Copilot-Backend](https://github.com/engrhassanraza/Research-Copilot-Backend)
over REST + SSE.

## Layout

```
app/          # Next.js App Router routes/layouts
components/   # Shared React components (shadcn/ui-based)
hooks/        # Custom React hooks
lib/          # Utilities (cn, etc.)
stores/       # Zustand stores
types/        # Shared TypeScript types
services/     # API client / fetch wrappers
```

## Getting started

Directory structure and config (`package.json`, `tsconfig.json`,
`tailwind.config.ts`) are scaffolded; dependencies aren't installed yet.

1. `npm install`
2. `copy .env.local.example .env.local` (create with `NEXT_PUBLIC_API_URL=http://localhost:8000`)
3. `npm run dev`

shadcn/ui components, TanStack Query provider wiring, and React Flow /
TipTap integration are added incrementally as features land.
