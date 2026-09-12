# CLAUDE.md

Guide for AI agents working in this repository. Keep it short; details live in the linked docs.

## Before writing code

1. Read `docs/CODING_STANDARDS.md`. The linter enforces most of it; the rest is on you.
2. Look for an existing pattern in `src/` before inventing one.
3. For library questions, use the Context7 MCP or `bunx @tanstack/cli search-docs "<query>" --library start --framework react`. Do not rely on memory for TanStack, Vite or React APIs.

## Stack

TanStack Start (React 19, Vite 8, Nitro, file-based routing) on bun, deployed to Vercel. Tailwind 4 + shadcn/ui, TanStack Query + Form, t3env, React Compiler, PostHog. TypeScript strict, ESLint 10 strict type-checked, Prettier, Vitest, Playwright, lefthook.

## Commands

| Task                   | Command                                   |
| ---------------------- | ----------------------------------------- |
| Install                | `bun install`                             |
| Dev server (port 3000) | `bun run dev`                             |
| Typecheck              | `bun run typecheck`                       |
| Lint / autofix         | `bun run lint` / `bun run lint:fix`       |
| Format / check         | `bun run format` / `bun run format:check` |
| Unit tests             | `bun run test` (`test:watch`)             |
| E2E tests              | `bun run test:e2e` (`test:e2e:ui`)        |
| Everything except e2e  | `bun run check`                           |
| Production build       | `bun run build`, then `bun run preview`   |
| Add shadcn component   | `bunx shadcn@latest add <name>`           |
| Add TanStack add-on    | `bunx @tanstack/cli add <id>`             |

Run `bun run check` before you say a task is done. Run `bun run test:e2e` when you touched routing, layout, or anything user-visible.

## Where things live

- `src/routes/` file-based routes, thin. `src/features/<name>/` feature code. `src/components/` shared UI, `src/components/ui/` shadcn primitives.
- `src/env.ts` is the only place environment variables are read. Add new ones there and in `.env.example`.
- `src/routeTree.gen.ts` is generated. Never edit it.
- `e2e/` Playwright specs. `*.test.tsx` next to the code for unit tests.
- `.docs/` local specs and plans, gitignored. Write new specs and plans there.

## Conventions the linter cannot catch

- Named exports, kebab-case files, one component per file.
- Data through route loaders and `createServerFn`, never `useEffect` fetching.
- Zod at every boundary (search params, server function input, env).
- Tests assert behaviour via roles and labels, never implementation.
- Conventional Commits. Do not use `--no-verify`.

## MCP servers (`.mcp.json`)

- `figma`: read designs and variables before implementing a screen. Ask for the Figma link if none is given.
- `mobbin`, `appllama`: research real-world UI patterns and flows before designing something new.
- `shadcn`: search and install registry components instead of hand-writing primitives.
- `playwright`: drive a real browser to verify UI changes and debug failing e2e tests.
- `posthog`: query analytics, flags, errors and session replays.
- `loops`: transactional email and contact management.
- `context7`: current library documentation.

Remote servers authenticate via browser OAuth on first use (`/mcp` in Claude Code). No tokens are stored in this repo.
