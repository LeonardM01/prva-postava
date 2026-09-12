# Coding Standards

These rules exist so that code written by anyone, human or AI, looks like it came from one careful engineer. The linter enforces most of them; this document explains the intent and covers what a linter cannot.

When a rule here and the linter disagree, the linter wins and this document must be fixed.

## 1. Principles

- **Clarity over cleverness.** Code is read many more times than it is written.
- **Small units.** One responsibility per file, per function, per component.
- **Types are documentation.** Make illegal states unrepresentable.
- **Fail loudly.** Never swallow an error or return a silent fallback.
- **Test behaviour, not implementation.**

## 2. TypeScript

- `strict` is on. No `any`, no `as any`, no `@ts-ignore`. Use `unknown` and narrow.
- No non-null assertions (`!`). Narrow with a guard or handle the `undefined` case.
- No `enum`. Use a union of string literals or an `as const` object.
- Object shapes are declared with `interface`. Unions, intersections and aliases use `type`.
- Prefer `readonly` for props, arrays and object fields that are not mutated.
- Use type-only imports inline: `import { type Foo, bar } from './x'`.
- Exhaustive `switch` over unions (the linter checks this). Add a `default` that throws only for truly unreachable cases.
- Parse at the boundary. Anything from the network, URL, storage or env goes through a Zod schema before it becomes a typed value.
- Use `??` not `||` for defaults. Use `===` always (`== null` is allowed).
- Template literals may embed strings and numbers only.

## 3. React

- Function components only, named exports, one component per file. The file name is kebab-case and matches the component: `user-card.tsx` exports `UserCard`.
- Props are an `interface` named `<Component>Props` declared in the same file, fields `readonly`.
- Components and hooks must be pure. No `new Date()`, `Math.random()` or reads of `window` during render. Compute at module level, in an event handler, or via `useSyncExternalStore`.
- Do not derive state in `useEffect`. Compute derived values during render. If a value is expensive, trust the React Compiler; do not hand-write `useMemo`/`useCallback` unless a profiler shows a need.
- `useEffect` is for synchronising with external systems only (DOM APIs, subscriptions, analytics). Never call `setState` synchronously inside an effect body.
- Follow the Rules of Hooks and the React Compiler rules (`eslint-plugin-react-hooks` `recommended-latest` is on).
- Event handlers are inline arrow functions with braces: `onClick={() => { doThing() }}`.
- Lists use stable keys from data, never the array index.
- No `dangerouslySetInnerHTML` except for static, code-owned strings, and then with an inline disable comment explaining why.
- Prefer composition over configuration props. If a component takes more than ~7 props, split it.

## 4. TanStack Start

- **Routing:** file-based routes in `src/routes`. Route files export `Route` only, plus the components they render. Keep route files thin; put real UI in `src/features/<feature>/`.
- **Data loading:** use route `loader`s (with `context.queryClient.ensureQueryData`) for data a page needs on first render. Do not fetch in `useEffect`.
- **Mutations and server-only code:** use `createServerFn`. Validate input with Zod via `.inputValidator`. Never import server-only modules (db, secrets) from client code; the Start ESLint plugin flags this.
- **Search params:** always declare `validateSearch` with a Zod schema. Read them with `Route.useSearch()`.
- **Redirects and not-found:** `throw redirect(...)` and `throw notFound()` are the only allowed non-Error throws.
- **TanStack Query:** query keys come from a key factory per feature (`userKeys.detail(id)`), never inline arrays. Query options live in `queryOptions()` helpers so loaders and components share them.
- **Forms:** TanStack Form with a Zod schema. No uncontrolled `FormData` parsing in components.
- **Env:** read environment variables only through `env` from `src/env.ts`. Never touch `import.meta.env` or `process.env` elsewhere. Add new variables to the schema and to `.env.example`.

## 5. Project structure

```
src/
  routes/            file-based routes (thin)
  features/<name>/   feature code: components, hooks, api, schema, tests
  components/        shared, feature-agnostic components
  components/ui/     shadcn/ui primitives (regenerate with the CLI; edit sparingly)
  integrations/      third-party wiring (posthog, tanstack-query)
  lib/               tiny pure utilities (cn)
  test/              test setup
e2e/                 Playwright specs
docs/                human and agent documentation
```

- Import from other modules with the `#/` alias (`#/features/auth/schema`). Relative imports only within the same folder.
- No barrel files (`index.ts` that re-exports). Import from the concrete file.
- No circular imports (the linter checks).
- Kebab-case file names everywhere except TanStack route conventions (`$id.tsx`, `_layout.tsx`, `__root.tsx`).

## 6. Naming

- Variables and functions: `camelCase`, descriptive, no abbreviations except the allowed set (`args`, `env`, `params`, `props`, `ref`, `utils`). `e` is not allowed; write `event` or `error`.
- Booleans read as predicates: `isOpen`, `hasError`, `canSubmit`.
- Functions are verbs: `loadUser`, `formatPrice`. Components and types are nouns in `PascalCase`.
- Constants that are truly constant: `SCREAMING_SNAKE_CASE` at module level.
- Zod schemas end in `Schema`; inferred types drop the suffix: `const userSchema = z.object(...)`, `type User = z.infer<typeof userSchema>`.

## 7. Error handling

- Throw `Error` subclasses (or TanStack's redirect/notFound), never strings or plain objects.
- Catch only where you can do something: translate, retry, or show UI. Otherwise let it propagate to the route `errorComponent`.
- Every route that loads data declares an `errorComponent` and a `pendingComponent`.
- Log with `console.error`/`console.warn` only; `console.log` is banned. Prefer PostHog exception capture for production errors.
- Promises are awaited or explicitly `void`ed. Never leave a floating promise.

## 8. Styling

- Tailwind utility classes in JSX. No inline `style` objects except for values computed at runtime (animation delays, dynamic sizes).
- Variants use `cva`; class merging uses `cn` from `#/lib/utils`.
- Design tokens are CSS variables in `src/styles.css`. Do not hardcode colours in components when a token exists.
- Prettier sorts classes; do not fight the order.
- Mobile-first: write base styles for small screens, then `sm:`/`md:`/`lg:` overrides.

## 9. Accessibility

- Semantic HTML first: `button` for actions, `a`/`Link` for navigation, headings in order, one `h1` per page.
- Every interactive element is keyboard reachable and has a visible focus state.
- Every form control has a label. Icon-only buttons have `aria-label`.
- Decorative graphics are `aria-hidden="true"`.
- `jsx-a11y` strict is on; fix findings, do not disable them.

## 10. Testing

- **Unit (Vitest):** colocated `*.test.tsx`. Test behaviour through the public surface: render, interact with `@testing-library/user-event`, assert on what the user sees. Never test internal state or implementation details. No snapshot tests.
- **E2E (Playwright):** `e2e/*.spec.ts`, run against the production build. Cover critical user journeys, not every screen.
- **Locators:** prefer `getByRole`, then `getByLabel`/`getByText`. `data-testid` is a last resort and must be justified in a comment.
- Assert with web-first assertions (`await expect(locator).toBeVisible()`), never `expect(await locator.isVisible())`.
- No `test.only`, no `test.skip` in committed code.
- A bug fix comes with a test that failed before the fix.

## 11. Comments and documentation

- Comments explain **why**, never **what**. If you need a comment to explain what, rename or split the code.
- No commented-out code. Delete it; git remembers.
- `TODO` is only allowed with an issue link: `// TODO(#123): …`.
- Exported functions with non-obvious behaviour get a one-paragraph JSDoc.

## 12. Size limits (soft)

- Functions: aim for under 40 lines. Cognitive complexity limit is 15 (linter).
- Components: under 150 lines. Split into subcomponents or hooks beyond that.
- Files: under 300 lines. A longer file is a signal to split by responsibility.

## 13. Git

- Conventional Commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`, `ci:`. Imperative mood, lower-case, no trailing period.
- One logical change per commit. Hooks format and lint staged files; do not bypass them with `--no-verify`.
- Never commit secrets, `.env` files, or the `.docs/` folder.

## 14. Dependencies

- Add a dependency only when it removes meaningful code. Prefer the platform and the existing stack.
- Pin nothing to `latest` in new additions; use caret ranges. Dependabot keeps things current.
- Run `bun run check` before opening a pull request.
