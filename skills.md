# lethwei — Working Skills File

> Stack: Next.js 14 + Prisma + next-auth + PostgreSQL. Check CLAUDE.md for product context and rules.

## How to Run

```bash
cd /Users/roopasom/code/lethwei
npm run dev
```

Check port in `package.json` or `next.config.ts`.

## Directory Map

| Path | What it does |
|------|-------------|
| `src/app/` | Next.js App Router — routes and pages |
| `src/app/api/` | API route handlers |
| `src/components/` | Reusable React components |
| `src/lib/` | Utilities, helpers, auth helpers |
| `prisma/schema.prisma` | Database schema |
| `prisma/migrations/` | Migration history |
| `prisma/seed.ts` | DB seed data |

## Existing Routes (check before adding)

`auth`, `forum`, `gyms`, `learn`, `shop` — all under `src/app/`

## Key Pattern: Adding a New Route

```
src/app/my-route/
  page.tsx       ← the page (Server Component by default)
  layout.tsx     ← optional layout wrapper
  loading.tsx    ← optional loading state
```

Add `"use client"` only if the component needs interactivity or browser APIs.

## DB Migrations (Prisma)

```bash
# After changing schema.prisma
npx prisma migrate dev --name describe_the_change

# Apply to prod (check CLAUDE.md for which DB)
npx prisma migrate deploy

# Regenerate client after schema change
npx prisma generate
```

Never edit existing migration files — only add new ones.

## Dangerous Areas

- `prisma/schema.prisma` — schema changes require a migration. Don't edit without generating and applying one.
- Auth routes under `src/app/auth/` and `src/app/api/auth/` — test login flow after any changes.
- The 401 → signup redirect flow (recently added) — check `middleware.ts` if auth redirects break.

## Git Rules

Never commit to `main`. Branch: `git checkout main && git pull origin main && git checkout -b feature/<name>`

## Self-Improvement Rule

When you add a route, discover how auth middleware works, or fix a Prisma migration issue — add it here. Auth + middleware gotchas especially.

## Recent Lessons

- **2026-06-14:** Redirect to signup on 401 + restore draft after login via `callbackUrl` flow was recently added — check `middleware.ts` if auth redirects behave unexpectedly.
