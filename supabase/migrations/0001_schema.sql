-- The Codex — content schema
-- Postgres 15+ / Supabase. Run with `supabase db push` or in the SQL editor.

create extension if not exists "pgcrypto";
create extension if not exists "unaccent";
create extension if not exists "pg_trgm";

-- ---------------------------------------------------------------- enums
do $$ begin
  create type content_status as enum ('draft', 'review', 'published');
exception when duplicate_object then null; end $$;

do $$ begin
  create type locale_code as enum ('pt', 'en', 'fr', 'de');
exception when duplicate_object then null; end $$;

do $$ begin
  create type relation_kind as enum ('related', 'opposite', 'broader', 'narrower');
exception when duplicate_object then null; end $$;

do $$ begin
  create type synonym_kind as enum ('synonym', 'near', 'alias');
exception when duplicate_object then null; end $$;

do $$ begin
  create type user_role as enum ('admin', 'editor', 'viewer');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------- users
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role user_role not null default 'viewer',
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------- helper trigger
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- --------------------------------------------------------------- periods
create table if not exists historical_periods (
  id text primary key,
  status content_status not null default 'draft',
  sort_order int not null default 0,
  start_year int not null,
  end_year int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
create table if not exists period_translations (
  period_id text not null references historical_periods(id) on delete cascade,
  locale locale_code not null,
  title text not null,
  slug text not null,
  summary text not null default '',
  events text[],
  seo_title text, seo_description text,
  primary key (period_id, locale),
  unique (locale, slug)
);

-- ------------------------------------------------------------ categories
create table if not exists categories (
  id text primary key,
  status content_status not null default 'draft',
  sort_order int not null default 0,
  hue int not null default 220,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
create table if not exists category_translations (
  category_id text not null references categories(id) on delete cascade,
  locale locale_code not null,
  title text not null,
  slug text not null,
  summary text not null default '',
  introduction text, definition text, questions text[],
  seo_title text, seo_description text,
  primary key (category_id, locale),
  unique (locale, slug)
);

-- --------------------------------------------------------------- schools
create table if not exists schools (
  id text primary key,
  status content_status not null default 'draft',
  period_id text not null references historical_periods(id),
  start_year int, end_year int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
create table if not exists school_translations (
  school_id text not null references schools(id) on delete cascade,
  locale locale_code not null,
  title text not null,
  slug text not null,
  summary text not null default '',
  definition text, body text, aliases text[],
  seo_title text, seo_description text,
  primary key (school_id, locale),
  unique (locale, slug)
);
create table if not exists school_influences (
  school_id text references schools(id) on delete cascade,
  influenced_by_id text references schools(id) on delete cascade,
  primary key (school_id, influenced_by_id)
);
create table if not exists school_relations (
  school_id text references schools(id) on delete cascade,
  related_id text references schools(id) on delete cascade,
  primary key (school_id, related_id)
);

-- ---------------------------------------------------------- philosophers
create table if not exists philosophers (
  id text primary key,
  status content_status not null default 'draft',
  featured boolean not null default false,
  birth_year int, death_year int, birth_year_approx boolean not null default false,
  period_id text not null references historical_periods(id),
  portrait_url text, portrait_alt text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
create table if not exists philosopher_translations (
  philosopher_id text not null references philosophers(id) on delete cascade,
  locale locale_code not null,
  title text not null,
  slug text not null,
  summary text not null default '',
  biography text, key_ideas text[], areas text[], aliases text[],
  seo_title text, seo_description text,
  primary key (philosopher_id, locale),
  unique (locale, slug)
);
create table if not exists philosopher_schools (
  philosopher_id text references philosophers(id) on delete cascade,
  school_id text references schools(id) on delete cascade,
  primary key (philosopher_id, school_id)
);
create table if not exists philosopher_categories (
  philosopher_id text references philosophers(id) on delete cascade,
  category_id text references categories(id) on delete cascade,
  primary key (philosopher_id, category_id)
);
create table if not exists philosopher_influences (
  philosopher_id text references philosophers(id) on delete cascade,
  influenced_by_id text references philosophers(id) on delete cascade,
  primary key (philosopher_id, influenced_by_id)
);

-- ---------------------------------------------------------------- works
create table if not exists works (
  id text primary key,
  status content_status not null default 'draft',
  author_id text not null references philosophers(id),
  year int, year_approx boolean not null default false,
  original_title text, original_language text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
create table if not exists work_translations (
  work_id text not null references works(id) on delete cascade,
  locale locale_code not null,
  title text not null,
  slug text not null,
  summary text not null default '',
  body text,
  seo_title text, seo_description text,
  primary key (work_id, locale),
  unique (locale, slug)
);
-- Kept for spec parity; authorship is canonical on works.author_id.
create table if not exists philosopher_works (
  philosopher_id text references philosophers(id) on delete cascade,
  work_id text references works(id) on delete cascade,
  primary key (philosopher_id, work_id)
);

-- -------------------------------------------------------------- concepts
create table if not exists concepts (
  id text primary key,
  status content_status not null default 'draft',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
create table if not exists concept_translations (
  concept_id text not null references concepts(id) on delete cascade,
  locale locale_code not null,
  title text not null,
  slug text not null,
  summary text not null default '',
  definition text, etymology text, body text,
  seo_title text, seo_description text,
  search_vector tsvector generated always as (
    setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(summary, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(definition, '')), 'C')
  ) stored,
  primary key (concept_id, locale),
  unique (locale, slug)
);
create index if not exists concept_translations_fts on concept_translations using gin (search_vector);
create index if not exists concept_translations_trgm on concept_translations using gin (title gin_trgm_ops);

create table if not exists synonyms (
  id uuid primary key default gen_random_uuid(),
  concept_id text not null references concepts(id) on delete cascade,
  locale locale_code not null,
  term text not null,
  kind synonym_kind not null default 'synonym'
);
create index if not exists synonyms_trgm on synonyms using gin (term gin_trgm_ops);

create table if not exists concept_relations (
  concept_id text references concepts(id) on delete cascade,
  related_id text references concepts(id) on delete cascade,
  kind relation_kind not null default 'related',
  primary key (concept_id, related_id, kind)
);
create table if not exists philosopher_concepts (
  philosopher_id text references philosophers(id) on delete cascade,
  concept_id text references concepts(id) on delete cascade,
  primary key (philosopher_id, concept_id)
);
create table if not exists category_concepts (
  category_id text references categories(id) on delete cascade,
  concept_id text references concepts(id) on delete cascade,
  primary key (category_id, concept_id)
);
create table if not exists concept_schools (
  concept_id text references concepts(id) on delete cascade,
  school_id text references schools(id) on delete cascade,
  primary key (concept_id, school_id)
);
create table if not exists concept_periods (
  concept_id text references concepts(id) on delete cascade,
  period_id text references historical_periods(id) on delete cascade,
  primary key (concept_id, period_id)
);
create table if not exists concept_works (
  concept_id text references concepts(id) on delete cascade,
  work_id text references works(id) on delete cascade,
  primary key (concept_id, work_id)
);
create table if not exists work_concepts (
  work_id text references works(id) on delete cascade,
  concept_id text references concepts(id) on delete cascade,
  primary key (work_id, concept_id)
);

-- --------------------------------------------------------------- sources
create table if not exists sources (
  id text primary key,
  type text not null check (type in ('book', 'article', 'encyclopedia', 'web')),
  authors text[] not null default '{}',
  title text not null,
  year int,
  publisher text,
  url text,
  locale locale_code,
  created_at timestamptz not null default now()
);
create table if not exists concept_sources (
  concept_id text references concepts(id) on delete cascade,
  source_id text references sources(id) on delete cascade,
  primary key (concept_id, source_id)
);
create table if not exists philosopher_sources (
  philosopher_id text references philosophers(id) on delete cascade,
  source_id text references sources(id) on delete cascade,
  primary key (philosopher_id, source_id)
);
create table if not exists work_sources (
  work_id text references works(id) on delete cascade,
  source_id text references sources(id) on delete cascade,
  primary key (work_id, source_id)
);

-- ----------------------------------------------------- future: embeddings
-- Placeholder for semantic search (Phase 6). Requires `vector` extension.
-- create extension if not exists vector;
-- create table if not exists search_embeddings (
--   doc_id text primary key, kind text, entity_id text, locale locale_code, embedding vector(1536)
-- );

-- ------------------------------------------------------ updated_at hooks
do $$ declare t text; begin
  foreach t in array array['historical_periods','categories','schools','philosophers','works','concepts'] loop
    execute format('drop trigger if exists %I_updated_at on %I', t, t);
    execute format('create trigger %I_updated_at before update on %I for each row execute function set_updated_at()', t, t);
  end loop;
end $$;

-- ------------------------------------------------------------------ RLS
-- Public may read published content; editors/admins may write everything.
create or replace function is_editor() returns boolean language sql stable as $$
  select exists (select 1 from profiles where id = auth.uid() and role in ('admin','editor'));
$$;

do $$ declare t text; begin
  foreach t in array array[
    'historical_periods','period_translations','categories','category_translations','schools','school_translations',
    'school_influences','school_relations','philosophers','philosopher_translations','philosopher_schools','philosopher_categories',
    'philosopher_influences','works','work_translations','philosopher_works','concepts','concept_translations','synonyms',
    'concept_relations','philosopher_concepts','category_concepts','concept_schools','concept_periods','concept_works','work_concepts',
    'sources','concept_sources','philosopher_sources','work_sources'
  ] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists %I_editor_all on %I', t, t);
    execute format('create policy %I_editor_all on %I for all using (is_editor()) with check (is_editor())', t, t);
  end loop;
end $$;

-- Published-only public read for the six content tables …
create policy concepts_public_read on concepts for select using (status = 'published');
create policy philosophers_public_read on philosophers for select using (status = 'published');
create policy schools_public_read on schools for select using (status = 'published');
create policy categories_public_read on categories for select using (status = 'published');
create policy works_public_read on works for select using (status = 'published');
create policy periods_public_read on historical_periods for select using (status = 'published');
-- … and for their translations / join tables, gated through the parent row.
create policy concept_translations_public_read on concept_translations for select using (exists (select 1 from concepts c where c.id = concept_id and c.status = 'published'));
create policy philosopher_translations_public_read on philosopher_translations for select using (exists (select 1 from philosophers p where p.id = philosopher_id and p.status = 'published'));
create policy school_translations_public_read on school_translations for select using (exists (select 1 from schools s where s.id = school_id and s.status = 'published'));
create policy category_translations_public_read on category_translations for select using (exists (select 1 from categories c where c.id = category_id and c.status = 'published'));
create policy work_translations_public_read on work_translations for select using (exists (select 1 from works w where w.id = work_id and w.status = 'published'));
create policy period_translations_public_read on period_translations for select using (exists (select 1 from historical_periods p where p.id = period_id and p.status = 'published'));
do $$ declare t text; begin
  foreach t in array array['school_influences','school_relations','philosopher_schools','philosopher_categories','philosopher_influences','philosopher_works','synonyms',
    'concept_relations','philosopher_concepts','category_concepts','concept_schools','concept_periods','concept_works','work_concepts','sources','concept_sources','philosopher_sources','work_sources'] loop
    execute format('drop policy if exists %I_public_read on %I', t, t);
    execute format('create policy %I_public_read on %I for select using (true)', t, t);
  end loop;
end $$;

alter table profiles enable row level security;
create policy profiles_self_read on profiles for select using (id = auth.uid());
create policy profiles_admin_all on profiles for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- ---------------------------------------------------------------- search
-- Unified search over every content translation. Combines full-text rank and
-- trigram similarity so that typos and partial words still hit.
create or replace function search_content(p_query text, p_locale locale_code, p_kinds text[] default null, p_limit int default 20)
returns table (id text, kind text, locale locale_code, title text, slug text, summary text, score real, "matchedOn" text)
language sql stable as $$
  with q as (select unaccent(lower(p_query)) as text, plainto_tsquery('simple', unaccent(p_query)) as ts),
  docs as (
    select 'concepts:'||concept_id||':'||locale as id, 'concepts' as kind, locale, title, slug, summary, search_vector as vec from concept_translations ct
      join concepts c on c.id = ct.concept_id where c.status = 'published'
    union all
    select 'philosophers:'||philosopher_id||':'||locale, 'philosophers', locale, title, slug, summary, to_tsvector('simple', title||' '||coalesce(summary,'')) from philosopher_translations pt
      join philosophers p on p.id = pt.philosopher_id where p.status = 'published'
    union all
    select 'schools:'||school_id||':'||locale, 'schools', locale, title, slug, summary, to_tsvector('simple', title||' '||coalesce(summary,'')) from school_translations st
      join schools s on s.id = st.school_id where s.status = 'published'
    union all
    select 'categories:'||category_id||':'||locale, 'categories', locale, title, slug, summary, to_tsvector('simple', title||' '||coalesce(summary,'')) from category_translations ca
      join categories c on c.id = ca.category_id where c.status = 'published'
    union all
    select 'works:'||work_id||':'||locale, 'works', locale, title, slug, summary, to_tsvector('simple', title||' '||coalesce(summary,'')) from work_translations wt
      join works w on w.id = wt.work_id where w.status = 'published'
    union all
    select 'periods:'||period_id||':'||locale, 'periods', locale, title, slug, summary, to_tsvector('simple', title||' '||coalesce(summary,'')) from period_translations pe
      join historical_periods p on p.id = pe.period_id where p.status = 'published'
  )
  select d.id, d.kind, d.locale, d.title, d.slug, d.summary,
    (ts_rank(d.vec, q.ts) * 10 + similarity(unaccent(lower(d.title)), q.text) * 5 + (case when d.locale = p_locale then 1 else 0 end))::real as score,
    (case when unaccent(lower(d.title)) like q.text || '%' then 'title' else 'fuzzy' end) as "matchedOn"
  from docs d, q
  where (p_kinds is null or d.kind = any(p_kinds))
    and (d.vec @@ q.ts or similarity(unaccent(lower(d.title)), q.text) > 0.25)
  order by score desc
  limit p_limit;
$$;
