# EduDiscover — India College Discovery Platform

## Overview

Full-stack college discovery platform for India. Students can browse, filter, compare, and save colleges. Powered by a real PostgreSQL dataset of 30 top Indian institutions.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec at `lib/api-spec/openapi.yaml`)
- **Frontend**: React + Vite (`artifacts/college-discovery`)
- **Auth**: Clerk (`@clerk/react` on frontend, `@clerk/express` on backend)
- **Build**: esbuild (API server bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/scripts run seed` — seed database with 30 Indian colleges

## Project Structure

```
artifacts/
  api-server/          — Express 5 REST API (port 8080, path: /api)
  college-discovery/   — React + Vite frontend (path: /)

lib/
  api-spec/            — OpenAPI spec + Orval codegen config
  api-client-react/    — Generated React Query hooks
  api-zod/             — Generated Zod validators (server-side)
  db/                  — Drizzle ORM schema + DB client

scripts/
  src/seed.ts          — DB seeder (30 colleges, 90 courses, 30 reviews)
```

## Auth (Clerk)

- Env vars: `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `VITE_CLERK_PUBLISHABLE_KEY`
- Frontend: `ClerkProvider` in `App.tsx`, `useAuth()` hook for auth state
- Backend: `clerkMiddleware` + `getAuth(req)` for protected routes
- Sign-in page: `/sign-in`, Sign-up: `/sign-up`
- Protected API routes: `GET/POST/DELETE /api/saved/colleges`, `GET/POST/DELETE /api/saved/comparisons`

## Codegen Notes

- Orval zod target uses `mode: "single"` with `target: "generated/api"` — generates to `lib/api-zod/src/generated/api/api.ts`
- After orval runs, the codegen script writes `lib/api-zod/src/index.ts` with a single export
- Do NOT add `schemas: { path: "generated/types" }` to the zod orval config — it causes duplicate export conflicts

## Database Schema

- `colleges` — 30 seeded Indian institutions (IITs, IIMs, NITs, private)
- `courses` — 3 courses per college (90 total)
- `reviews` — student reviews
- `questions` / `answers` — student Q&A
- `saved_colleges` / `saved_comparisons` — per-user saved items (auth-gated)

## Environment Secrets

- `MONGO_URL` — PostgreSQL connection string
- `SESSION_SECRET` — session secret
- `CLERK_PUBLISHABLE_KEY` — Clerk backend key
- `CLERK_SECRET_KEY` — Clerk secret key
- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk frontend publishable key
