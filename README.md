# The Philosophy Codex

Multilingual philosophy research platform: dictionary + encyclopedia + search engine + timeline + knowledge network. Built with Next.js 16 (App Router), TypeScript strict, CSS Modules, Inter, and a Supabase-ready data layer. Visual direction: Refined Journal (light, black on white, ruled card grid).

Architecture, data model and roadmap: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Run

```bash
pnpm install
cp .env.example .env.local   # DATA_SOURCE=seed by default
pnpm dev                     # http://localhost:3000 → redirects to /pt (or your browser language)
```

Production:

```bash
pnpm build && pnpm start
```

Quality gates: `pnpm exec tsc --noEmit` · `pnpm lint` · `pnpm build`.

## URLs

| Page | pt | en | fr | de |
| --- | --- | --- | --- | --- |
| Concepts | /pt/conceitos | /en/concepts | /fr/concepts | /de/begriffe |
| Philosophers | /pt/filosofos | /en/philosophers | /fr/philosophes | /de/philosophen |
| Schools | /pt/escolas | /en/schools | /fr/ecoles | /de/schulen |
| Categories | /pt/categorias | /en/categories | /fr/categories | /de/kategorien |
| Works | /pt/obras | /en/works | /fr/oeuvres | /de/werke |
| Timeline | /pt/cronologia | /en/timeline | /fr/chronologie | /de/chronologie |
| Search | /pt/pesquisa?q= | /en/search?q= | /fr/recherche?q= | /de/suche?q= |

Every entity page also exists in each locale with its own slug (e.g. `/pt/conceitos/metafisica` ↔ `/de/begriffe/metaphysik`), linked through `hreflang` and the language switcher.

## Data sources

- `DATA_SOURCE=seed` (default): bundled demo dataset in `src/data/seed`. Reference facts (names, dates, affiliations) plus short definitions; long-form bodies are intentionally empty and shown as "editorial content pending".
- `DATA_SOURCE=supabase`: Postgres via Supabase. Apply `supabase/migrations/0001_schema.sql`, set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. Public reads are limited by RLS to `status = 'published'`.

Pages never touch the database directly; they use `getRepository()` from `src/lib/data`.

## Search

`GET /api/search?q=&locale=&kinds=&limit=` — in-memory index (normalized, prefix, synonym/alias, cross-locale, bigram fuzzy). With Supabase, the same `SearchProvider` interface delegates to the `search_content` SQL function (tsvector + pg_trgm). ⌘K / Ctrl K opens the command palette; `/` focuses it.

## Backoffice

`/admin` — separate root layout. With Supabase configured it requires a signed-in user whose `profiles.role` is `admin` or `editor`. Without Supabase it opens in development only (read-only seed mode) and returns 404 in production.

## Project layout

```
src/app/[locale]/                 pages (home, [section], [section]/[slug], search-results)
src/app/admin/                    backoffice
src/app/api/search/               autocomplete endpoint
src/components/{ui,layout,navigation,search,home,entities,pages,timeline,content,motion,admin}
src/lib/{i18n,domain,data,search,seo,analytics,supabase,admin,utils}
src/data/seed/                    demo dataset
src/styles/                       tokens + globals
supabase/migrations/              schema, RLS, search RPC
docs/ARCHITECTURE.md
```

## Deploy on Vercel

1. Import the GitHub repository in Vercel. The framework (Next.js) and pnpm are detected automatically; keep the default build command (`pnpm build`) and output settings.
2. Set the environment variables (Project → Settings → Environment Variables):
   - `NEXT_PUBLIC_SITE_URL` — the public URL, e.g. `https://thephilosophycodex.vercel.app` (used for canonical URLs, hreflang, sitemap and JSON-LD).
   - `DATA_SOURCE=seed` — serves the bundled content; switch to `supabase` only after configuring the Supabase variables.
   - `NEXT_PUBLIC_ANALYTICS=none`
   - Optional: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (backoffice and database).
3. Node.js 20.9 or newer is required (Vercel's default Node version works). If the install step complains about the pnpm version, add `ENABLE_EXPERIMENTAL_COREPACK=1` so Vercel uses the version pinned in `package.json`.
