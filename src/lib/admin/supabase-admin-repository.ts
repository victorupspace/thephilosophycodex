import { locales } from "@/lib/i18n/config";
import type { ContentStatus, Concept, Philosopher, School, Category, Work, Period } from "@/lib/domain/types";
import type { AdminEntity, AdminEntityKind, AdminListItem, AdminRepository } from "@/lib/data/repository";
import { createServerSupabase } from "@/lib/supabase/server";

const tables: Record<AdminEntityKind, { table: string; translations: string; fk: string }> = {
  concepts: { table: "concepts", translations: "concept_translations", fk: "concept_id" },
  philosophers: { table: "philosophers", translations: "philosopher_translations", fk: "philosopher_id" },
  schools: { table: "schools", translations: "school_translations", fk: "school_id" },
  categories: { table: "categories", translations: "category_translations", fk: "category_id" },
  works: { table: "works", translations: "work_translations", fk: "work_id" },
  periods: { table: "historical_periods", translations: "period_translations", fk: "period_id" },
};

/** Columns that exist on each translations table (the form sends a superset). */
const allowed: Record<AdminEntityKind, string[]> = {
  concepts: ["title", "slug", "summary", "definition", "etymology", "body", "seo_title", "seo_description"],
  philosophers: ["title", "slug", "summary", "biography", "key_ideas", "areas", "seo_title", "seo_description"],
  schools: ["title", "slug", "summary", "definition", "body", "seo_title", "seo_description"],
  categories: ["title", "slug", "summary", "introduction", "definition", "questions", "seo_title", "seo_description"],
  works: ["title", "slug", "summary", "body", "seo_title", "seo_description"],
  periods: ["title", "slug", "summary", "events", "seo_title", "seo_description"],
};

type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * Write-side Supabase implementation. Uses the request-scoped client so RLS
 * (is_editor()) is enforced by Postgres, not by application code.
 * Covers base rows + translations; relation tables get a dedicated editor next.
 */
export class SupabaseAdminRepository implements AdminRepository {
  readonly writable = true;

  private async client() {
    const c = await createServerSupabase();
    if (!c) throw new Error("Supabase not configured");
    return c;
  }

  async list(kind: AdminEntityKind): Promise<AdminListItem[]> {
    const c = await this.client();
    const { table, translations, fk } = tables[kind];
    const [{ data: rows, error }, { data: tr }] = await Promise.all([c.from(table).select("id,status,updated_at"), c.from(translations).select(`${fk},locale,title,slug`)]);
    if (error) throw error;
    return ((rows ?? []) as Row[]).map((r) => {
      const mine = ((tr ?? []) as Row[]).filter((t) => t[fk] === r.id);
      const pt = mine.find((t) => t.locale === "pt") ?? mine[0];
      return { id: r.id as string, kind, title: pt?.title ?? r.id, slug: pt?.slug ?? "", status: r.status as ContentStatus, locales: mine.map((t) => t.locale as (typeof locales)[number]), updatedAt: r.updated_at as string };
    }).sort((a, b) => a.title.localeCompare(b.title));
  }

  async get(kind: AdminEntityKind, id: string): Promise<AdminEntity | null> {
    const c = await this.client();
    const { table, translations, fk } = tables[kind];
    const [{ data: rowData }, { data: tr }] = await Promise.all([c.from(table).select("*").eq("id", id).maybeSingle(), c.from(translations).select("*").eq(fk, id)]);
    const row = rowData as Row | null;
    if (!row) return null;
    const t = Object.fromEntries(((tr ?? []) as Row[]).map((x) => [x.locale, { title: x.title, slug: x.slug, summary: x.summary ?? "", definition: x.definition, etymology: x.etymology, body: x.body, biography: x.biography, introduction: x.introduction, keyIdeas: x.key_ideas, areas: x.areas, questions: x.questions, events: x.events, seoTitle: x.seo_title, seoDescription: x.seo_description }]));
    const base = { id: row.id, status: row.status, createdAt: row.created_at, updatedAt: row.updated_at, publishedAt: row.published_at, translations: t };
    switch (kind) {
      case "concepts": return { ...base, featured: row.featured, categoryIds: [], philosopherIds: [], schoolIds: [], periodIds: [], workIds: [], sourceIds: [], relations: [] } as Concept;
      case "philosophers": return { ...base, featured: row.featured, birthYear: row.birth_year, deathYear: row.death_year, birthYearApprox: row.birth_year_approx, periodId: row.period_id, schoolIds: [], categoryIds: [], influencedByIds: [], sourceIds: [], portrait: row.portrait_url ? { src: row.portrait_url, alt: row.portrait_alt ?? "" } : null } as Philosopher;
      case "schools": return { ...base, periodId: row.period_id, startYear: row.start_year, endYear: row.end_year, influencedByIds: [], relatedSchoolIds: [] } as School;
      case "categories": return { ...base, order: row.sort_order, hue: row.hue } as Category;
      case "works": return { ...base, authorId: row.author_id, year: row.year, yearApprox: row.year_approx, originalTitle: row.original_title ?? "", originalLanguage: row.original_language ?? "", conceptIds: [], sourceIds: [] } as Work;
      case "periods": return { ...base, order: row.sort_order, startYear: row.start_year, endYear: row.end_year } as Period;
    }
  }

  async upsert(kind: AdminEntityKind, entity: AdminEntity): Promise<AdminEntity> {
    const c = await this.client();
    const { table, translations, fk } = tables[kind];
    const baseRow: Row = { id: entity.id, status: entity.status };
    if ("featured" in entity) baseRow.featured = entity.featured ?? false;
    if (kind === "philosophers") { const p = entity as Philosopher; Object.assign(baseRow, { birth_year: p.birthYear, death_year: p.deathYear, birth_year_approx: !!p.birthYearApprox, period_id: p.periodId }); }
    if (kind === "schools") { const s = entity as School; Object.assign(baseRow, { period_id: s.periodId, start_year: s.startYear, end_year: s.endYear }); }
    if (kind === "categories") { const s = entity as Category; Object.assign(baseRow, { sort_order: s.order, hue: s.hue }); }
    if (kind === "works") { const w = entity as Work; Object.assign(baseRow, { author_id: w.authorId, year: w.year, year_approx: !!w.yearApprox, original_title: w.originalTitle, original_language: w.originalLanguage }); }
    if (kind === "periods") { const p = entity as Period; Object.assign(baseRow, { sort_order: p.order, start_year: p.startYear, end_year: p.endYear }); }
    if (entity.status === "published") baseRow.published_at = entity.publishedAt ?? new Date().toISOString();

    const { error } = await c.from(table).upsert(baseRow);
    if (error) throw error;

    const trRows: Row[] = locales.flatMap((l) => {
      const t = entity.translations[l] as Row | undefined;
      if (!t) return [];
      const full: Row = {
        [fk]: entity.id, locale: l, title: t.title, slug: t.slug, summary: t.summary ?? "",
        definition: t.definition ?? null, etymology: t.etymology ?? null, body: t.body ?? null, biography: t.biography ?? null, introduction: t.introduction ?? null,
        key_ideas: t.keyIdeas ?? null, areas: t.areas ?? null, questions: t.questions ?? null, events: t.events ?? null,
        seo_title: t.seoTitle ?? null, seo_description: t.seoDescription ?? null,
      };
      return [Object.fromEntries(Object.entries(full).filter(([k]) => k === fk || k === "locale" || allowed[kind].includes(k)))];
    });
    if (trRows.length) {
      const { error: trError } = await c.from(translations).upsert(trRows, { onConflict: `${fk},locale` });
      if (trError) throw trError;
    }
    return (await this.get(kind, entity.id))!;
  }

  async setStatus(kind: AdminEntityKind, id: string, status: ContentStatus) {
    const c = await this.client();
    const patch: Row = { status };
    if (status === "published") patch.published_at = new Date().toISOString();
    const { error } = await c.from(tables[kind].table).update(patch).eq("id", id);
    if (error) throw error;
  }

  async remove(kind: AdminEntityKind, id: string) {
    const c = await this.client();
    const { error } = await c.from(tables[kind].table).delete().eq("id", id);
    if (error) throw error;
  }

  async counts() {
    const c = await this.client();
    const out = {} as Record<AdminEntityKind, { total: number; published: number; draft: number; review: number }>;
    for (const kind of Object.keys(tables) as AdminEntityKind[]) {
      const { data } = await c.from(tables[kind].table).select("status");
      const s = ((data ?? []) as Row[]).map((r) => r.status as ContentStatus);
      out[kind] = { total: s.length, published: s.filter((x) => x === "published").length, draft: s.filter((x) => x === "draft").length, review: s.filter((x) => x === "review").length };
    }
    return out;
  }
}
