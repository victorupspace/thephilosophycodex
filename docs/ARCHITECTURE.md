# The Codex — Architecture

A multilingual philosophy research platform: dictionary + encyclopedia + search engine + chronology + knowledge map.

## 1. Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) | Server Components, static generation, ISR, metadata API |
| Language | TypeScript strict | Contract-first data model, safe refactors |
| Styling | CSS Modules + design tokens (`src/styles`) | Bespoke editorial identity, zero runtime, no utility-class noise |
| Motion | `motion` only for user-triggered UI (palette, menus). No entrance/scroll animation by design (journal direction). | Content first; motion answers actions only |
| Icons | `lucide-react` | Consistent stroke set, tree-shakeable |
| Backend | Supabase (Postgres, Auth, RLS, Storage) behind a repository interface | Swap seed → database without touching UI |
| Validation | `zod` | Admin forms and API inputs |

Rendering policy: **content first, JavaScript second.** Every content route is a Server Component prerendered with `generateStaticParams` and revalidated (ISR). Client Components are limited to: header scroll state, language switcher, command palette, motion wrappers, timeline scrubber, admin forms.

## 2. Internationalization

- Locales: `pt` (PT-BR), `en`, `fr`, `de`. Default: `pt`.
- URL model: `/{locale}/{localized-section}/{localized-slug}` e.g. `/pt/conceitos/metafisica`, `/en/concepts/metaphysics`, `/de/begriffe/metaphysik`.
- `src/lib/i18n/routes.ts` holds the section route map (`concepts → conceitos | concepts | concepts | begriffe`). The dynamic `[section]` segment resolves the localized name back to an entity kind. No rewrites, no middleware coupling: URLs are real static paths.
- `src/proxy.ts` only negotiates the locale for paths that lack one (Accept-Language + cookie) and guards `/admin`.
- Content is localized at the data level: every entity has a `translations` map keyed by locale (title, slug, summary, body…). Missing translations fall back (`requested → en → pt`) and the fallback is flagged so the UI can label it.
- UI strings live in typed dictionaries (`src/lib/i18n/dictionaries/*.ts`).

## 3. Information architecture

```
/                        → redirect to /{locale}
/{l}                     → Home (hero search, categories, philosophers, timeline, questions, periods, featured, editorial)
/{l}/explorar            → Explore hub (all entry points)
/{l}/conceitos           → Concept index (A–Z, by category)
/{l}/conceitos/{slug}    → Concept page
/{l}/filosofos           → Philosopher index (by period)
/{l}/filosofos/{slug}    → Philosopher page
/{l}/escolas             → Schools index
/{l}/escolas/{slug}      → School page
/{l}/categorias          → Categories index
/{l}/categorias/{slug}   → Category landing
/{l}/obras               → Works index
/{l}/obras/{slug}        → Work page
/{l}/cronologia          → Full timeline
/{l}/cronologia/{slug}   → Period page
/{l}/pesquisa?q=         → Full search results (SSR, indexable)
/{l}/sobre|metodologia|fontes|contato → Platform pages
/admin/**                → Backoffice (separate root layout, auth-guarded)
/api/search              → Autocomplete endpoint (JSON, cached)
/sitemap.xml, /robots.txt
```

## 4. Data model

Entities are relational; every "content" entity has a `*_translations` table.

```
concepts ─┬─ concept_translations (locale, title, slug, summary, definition, etymology, body, seo_*)
          ├─ synonyms (locale, term, kind: synonym|near|alias)
          ├─ concept_relations (concept_id, related_id, kind: related|opposite|broader|narrower)
          ├─ category_concepts ──── categories ── category_translations
          ├─ philosopher_concepts ─ philosophers ─ philosopher_translations
          ├─ concept_schools ────── schools ───── school_translations
          ├─ concept_periods ────── historical_periods ── period_translations
          └─ concept_sources ────── sources
philosophers ─┬─ philosopher_schools, philosopher_works ── works ── work_translations
              ├─ philosopher_influences (from_id, to_id)
              └─ philosopher_categories
users (Supabase auth) ── profiles (role: admin|editor|viewer)
```

Every content row carries `status (draft|review|published)`, `created_at`, `updated_at`, `published_at`. Public reads are restricted by RLS to `status = 'published'`. See `supabase/migrations/0001_schema.sql`.

TypeScript mirror: `src/lib/domain/types.ts`. Locale-resolved views (`ConceptView`, `PhilosopherView`…) are what pages consume.

## 5. Data access layers

```
src/lib/data/
  repository.ts          ← ContentRepository interface (read) + AdminRepository (write)
  seed-repository.ts     ← in-memory implementation over src/data/seed (dev/demo)
                           (TS demo set + editorial JSON layer in src/data/seed/content, see docs/CONTENT.md)
  supabase-repository.ts ← Postgres implementation (same interface)
  index.ts               ← getRepository() chooses by DATA_SOURCE env
src/lib/search/
  provider.ts            ← SearchProvider interface (query, suggest)
  memory-provider.ts     ← normalized + fuzzy (bigram) index over the repository
  supabase-provider.ts   ← delegates to Postgres FTS/trigram RPC (search_content)
```

Pages never query Supabase directly. They call the repository; the repository is the only place that knows about the data source.

## 6. Search

- Index documents: every entity in every locale, plus synonyms, aliases and cross-locale titles.
- Ranking: exact > prefix > word prefix > fuzzy (Sørensen–Dice on bigrams) × kind weight × locale match.
- Evolution path: Postgres `tsvector` + `pg_trgm` (migration included) → embeddings (`search_embeddings` table placeholder) → semantic ranking. The `SearchProvider` interface does not change.

## 7. SEO

- `generateMetadata` per route with title template, description, canonical, `alternates.languages` (hreflang for the four locales + `x-default`), Open Graph and Twitter cards.
- JSON-LD: `WebSite` (+ `SearchAction`) on home, `DefinedTerm` for concepts, `Person` for philosophers, `Organization`/`CollectionPage` for schools/categories, `BreadcrumbList` everywhere.
- `sitemap.ts` enumerates every published entity in every locale; `robots.ts` blocks `/admin` and `/api`.

## 8. Design system

Tokens in `src/styles/tokens.css`. Direction modelled on refinedjournal.org: light mode only, Inter for everything (800 display, 700 headings, 400 body, 500–600 meta), pure black on white, structure made of 1px black rules (shared-border card grid), square boxes, pill tags only. Components in `src/components/ui`. Cards are typographic cells of the ruled grid (`.grid` draws the shared 1px rules): head (fact left, classifying pill right) → the title in Inter 800 at 28–40px (type alone carries the weight the image carries on Refined Journal; no background) → plain body → bottom-anchored 14/600 footer; `density="list"` and `density="compact"` drop the plate. No borders, shadows, radius or min-height on the card itself.

## 9. Motion

- `motion`: dropdown, mobile menu and command-palette transitions (user-triggered only).
- No reveal-on-scroll, hero intro or timeline scroll animation: the approved design direction (Refined Journal) has no decorative motion, and dropping it keeps the home bundle small.
- Everything respects `prefers-reduced-motion` (motion `useReducedMotion`).

## 10. Analytics

`src/lib/analytics` exposes a typed `track()` with a pluggable transport. Events: `search_started`, `search_completed`, `concept_viewed`, `philosopher_viewed`, `category_viewed`, `language_changed`, `related_content_clicked`. Default transport is a no-op (console in development).

## 11. Backoffice

`/admin` is a separate root layout. Access rule: Supabase session with `profiles.role in ('admin','editor')`; when Supabase is not configured, the backoffice is reachable only in development. Server Actions validate with zod and write through `AdminRepository`.

## 12. Roadmap status

- Phase 1 Foundation ✅ · Phase 2 Content ✅ · Phase 3 Search ✅ (in-memory, FTS-ready) · Phase 4 Backend ✅ (schema, RLS, repository, admin skeleton) · Phase 5 SEO ✅ · Phase 6 Advanced ⏳ (interfaces prepared: knowledge graph via `concept_relations`, semantic search via `SearchProvider`).
