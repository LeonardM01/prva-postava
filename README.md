# Prva postava

[![CI](https://github.com/LeonardM01/prva-postava/actions/workflows/ci.yml/badge.svg)](https://github.com/LeonardM01/prva-postava/actions/workflows/ci.yml)

TanStack Start application. See `CLAUDE.md` for the agent guide and `docs/CODING_STANDARDS.md` for conventions.

## Getting started

```bash
bun install          # also installs git hooks
cp .env.example .env # optional: fill in PostHog
bun run dev          # http://localhost:3000
```

## Scripts

`bun run check` runs typecheck, lint, format check and unit tests. `bun run test:e2e` builds and runs Playwright against the production build. All of these run in GitHub Actions on every pull request.

## Deployment

Configured for Vercel via `vercel.json` and the TanStack Start Vercel adapter. Connect the repository in Vercel; no extra build settings are required.
