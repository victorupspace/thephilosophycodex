<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# The Codex — project notes for agents

- Read `docs/ARCHITECTURE.md` first. Pages consume the `ContentRepository` interface (`src/lib/data`); never query Supabase from components.
- Localized URLs come from `src/lib/i18n/routes.ts`. Use `href(locale, kind, slug)` for every internal link.
- Every content route under `src/app/[locale]` must stay static (SSG + ISR). Do not use `headers()`, `cookies()` or `searchParams` there; the only dynamic content route is `[locale]/search-results`, reached via a rewrite in `src/proxy.ts`.
- `not-found.tsx` under `[locale]` is a client component on purpose (a server not-found using request APIs would make every page dynamic).
- UI strings live in `src/lib/i18n/dictionaries/*.ts` (typed by the `pt` dictionary). Content is localized per entity via `translations`.
- Seed data (`src/data/seed`) has two layers: the hand-written TypeScript demo set and the editorial JSON layer in `src/data/seed/content/*.json` (validated by `schema.ts`, merged in `index.ts`). Keep facts verifiable; follow `docs/CONTENT.md` for the editorial standards. Never invent quotations, works or dates.
- Quality gates before finishing: `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build` (expect all `[locale]` routes marked ● SSG).
- Card system (`src/components/ui/Card.tsx`): compose `Card` → `CardHead meta tag` (fact left in 14/500: dates, span, counts or near terms; classifying pill right; always rendered in default cards so plates align) → `CardTitle href` (the title in Inter 800 at 28–40px, sized by container units — it carries the weight the image carries on Refined Journal, by type alone; no background, no box) → `CardSummary` (16px, unclamped) → optional `CardNote` (14px muted) → optional `CardFooter` (14px/600, bottom-anchored). `density="list"` (results pages) and `density="compact"` (relation lists) drop the plate. The parent `.grid` draws the borders; never add borders, shadows, radius, min-height or a pill that only states the obvious kind. Counts use the singular keys and drop zeros.
