# Editorial content pipeline

The reference content of The Philosophy Codex lives in two layers under `src/data/seed`:

| Layer | Files | Purpose |
|---|---|---|
| Hand-written demo set | `categories.ts`, `periods.ts`, `schools.ts`, `philosophers.ts`, `concepts.ts`, `works.ts`, `sources.ts` | The original seed: 12 categories, 7 periods and the first entries. |
| Editorial content | `content/{concepts,philosophers,works,schools}.json` | Research-grade entries produced by the editorial pipeline, validated with zod (`schema.ts`) when the seed module loads. |

`index.ts` merges both layers. Ids must be unique across layers; a duplicate throws at build time. Entries in the
JSON layer carry no timestamps: `index.ts` stamps them with the content release date.

## Editorial standards (summary)

Every entry is written in the four locales (pt-BR, en, fr, de) by a writer in that language, not translated word by word.

- **Facts first.** Dates, titles, original titles, attributions and etymologies must be verifiable in standard
  reference works (Stanford Encyclopedia of Philosophy, Routledge, Abbagnano, Lalande, Historisches Wörterbuch der
  Philosophie). No invented quotations or works. Uncertain dates use `birthYearApprox` / `yearApprox`; BCE years are negative.
- **Concepts**: `summary` (≤ 180 chars), `definition` (2–4 sentences), `etymology` (pt/en required), `body`
  (3–5 paragraphs, 220–380 words: problem and definition → historical formation → main positions → related concepts),
  `synonyms`, `nearTerms`, `aliases`, cross-references (`philosopherIds`, `schoolIds`, `periodIds`, `workIds`,
  `relations` with `related | opposite | broader | narrower`) and `sourceIds`.
- **Philosophers**: dates, period, schools, categories, well-documented `influencedByIds`, `areas` (exact category
  titles in that language), `keyIdeas` (4–6), `biography` (3–5 paragraphs, 220–380 words), `aliases`.
- **Works**: author, first-edition year, original title and language, `conceptIds`, standard translated title per
  language, `summary`, `body` (2–3 paragraphs).
- **Schools**: period, span, influences, `definition`, `body` (3–4 paragraphs).
- **Slugs**: lowercase ASCII with hyphens, derived from the title in each language, unique per language and kind.
- **Prose**: sober third person; titles of works in `*asterisks*` (rendered as italics by `RichText`); no headings,
  lists or HTML inside prose fields.

## Pipeline

1. A roster fixes the ids and the hard facts (dates, author, year, period, categories) before any prose is written.
2. Writer agents produce one JSON file per entity from the roster and the standards.
3. Independent verifier agents fact-check and language-review each file and correct it in place.
4. A structural validator checks JSON validity, required fields, id references, slug uniqueness, `areas`, lengths
   and placeholders; the files are then assembled (sorted by roster order) into `src/data/seed/content/*.json`.
5. `pnpm exec tsc --noEmit`, `pnpm lint` and `pnpm build` must pass; new pages, search and sitemap are checked on a
   production server.

Content in the JSON layer is the source of truth until the platform runs on Supabase; the `supabase/` schema
accepts the same shapes, so the JSON can be loaded with a one-off import script.
