import type { Locale } from "@/lib/i18n/config";
import type {
  Category, Concept, ContentStatus, Period, Philosopher, School, Source, Work,
  ConceptTranslation, PhilosopherTranslation, SchoolTranslation, CategoryTranslation, WorkTranslation, PeriodTranslation,
} from "@/lib/domain/types";
import { createServiceClient } from "@/lib/supabase/server";
import type { ContentRepository } from "./repository";
import { SeedRepository } from "./seed-repository";

type Row = Record<string, unknown>;

/**
 * Postgres implementation. Strategy: load the published graph once per
 * process (revalidated with ISR) and reuse the in-memory view builder. This
 * keeps one code path for relation resolution and is more than fast enough
 * for an editorial corpus. Per-query SQL can replace individual methods later
 * without changing the interface.
 */
export class SupabaseRepository implements ContentRepository {
  readonly source = "supabase" as const;
  private inner: Promise<SeedRepository> | null = null;

  private load(): Promise<SeedRepository> {
    if (!this.inner) this.inner = this.fetchDataset().then((d) => new SeedRepository(d));
    return this.inner;
  }

  private async fetchDataset() {
    const client = createServiceClient();
    if (!client) throw new Error("Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / key missing).");

    const q = async (table: string, select = "*") => {
      const { data, error } = await client.from(table).select(select);
      if (error) throw new Error(`[supabase] ${table}: ${error.message}`);
      return (data ?? []) as unknown as Row[];
    };

    const [
      concepts, conceptT, philosophers, philosopherT, schools, schoolT, categories, categoryT, works, workT, periods, periodT, sources,
      synonyms, conceptRelations, philosopherConcepts, philosopherSchools, categoryConcepts, conceptSources, conceptSchools, conceptPeriods, conceptWorks,
      philosopherCategories, philosopherInfluences, philosopherSources, workConcepts, workSources, schoolInfluences, schoolRelations,
    ] = await Promise.all([
      q("concepts"), q("concept_translations"), q("philosophers"), q("philosopher_translations"), q("schools"), q("school_translations"),
      q("categories"), q("category_translations"), q("works"), q("work_translations"), q("historical_periods"), q("period_translations"), q("sources"),
      q("synonyms"), q("concept_relations"), q("philosopher_concepts"), q("philosopher_schools"), q("category_concepts"), q("concept_sources"),
      q("concept_schools"), q("concept_periods"), q("concept_works"), q("philosopher_categories"), q("philosopher_influences"), q("philosopher_sources"),
      q("work_concepts"), q("work_sources"), q("school_influences"), q("school_relations"),
    ]);

    const group = <T extends Row>(rows: T[], key: string) => {
      const m = new Map<string, T[]>();
      for (const r of rows) { const k = String(r[key]); if (!m.has(k)) m.set(k, []); m.get(k)!.push(r); }
      return m;
    };
    const ids = (rows: Row[] | undefined, key: string) => (rows ?? []).map((r) => String(r[key]));
    const stamps = (r: Row) => ({ createdAt: String(r.created_at), updatedAt: String(r.updated_at), publishedAt: (r.published_at as string | null) ?? null, status: r.status as ContentStatus });
    const trans = <T>(rows: Row[] | undefined, map: (r: Row) => T) => Object.fromEntries((rows ?? []).map((r) => [r.locale as Locale, map(r)])) as Partial<Record<Locale, T>>;
    const base = (r: Row) => ({ title: String(r.title), slug: String(r.slug), summary: String(r.summary ?? ""), seoTitle: r.seo_title as string | undefined, seoDescription: r.seo_description as string | undefined });

    const gConceptT = group(conceptT, "concept_id"), gSyn = group(synonyms, "concept_id"), gRel = group(conceptRelations, "concept_id");
    const gPhC = group(philosopherConcepts, "concept_id"), gCatC = group(categoryConcepts, "concept_id"), gCS = group(conceptSources, "concept_id");
    const gCSch = group(conceptSchools, "concept_id"), gCPer = group(conceptPeriods, "concept_id"), gCW = group(conceptWorks, "concept_id");
    const gPhT = group(philosopherT, "philosopher_id"), gPhS = group(philosopherSchools, "philosopher_id"), gPhCat = group(philosopherCategories, "philosopher_id");
    const gPhInf = group(philosopherInfluences, "philosopher_id"), gPhSrc = group(philosopherSources, "philosopher_id");
    const gSchT = group(schoolT, "school_id"), gSchInf = group(schoolInfluences, "school_id"), gSchRel = group(schoolRelations, "school_id");
    const gCatT = group(categoryT, "category_id"), gWT = group(workT, "work_id"), gWC = group(workConcepts, "work_id"), gWS = group(workSources, "work_id"), gPT = group(periodT, "period_id");

    const synonymsFor = (id: string, locale: string, kind: string) => (gSyn.get(id) ?? []).filter((s) => s.locale === locale && s.kind === kind).map((s) => String(s.term));

    return {
      concepts: concepts.map((r): Concept => ({
        id: String(r.id), ...stamps(r), featured: !!r.featured,
        categoryIds: ids(gCatC.get(String(r.id)), "category_id"), philosopherIds: ids(gPhC.get(String(r.id)), "philosopher_id"),
        schoolIds: ids(gCSch.get(String(r.id)), "school_id"), periodIds: ids(gCPer.get(String(r.id)), "period_id"),
        workIds: ids(gCW.get(String(r.id)), "work_id"), sourceIds: ids(gCS.get(String(r.id)), "source_id"),
        relations: (gRel.get(String(r.id)) ?? []).map((x) => ({ conceptId: String(x.related_id), kind: x.kind as Concept["relations"][number]["kind"] })),
        translations: trans<ConceptTranslation>(gConceptT.get(String(r.id)), (t) => ({ ...base(t), definition: t.definition as string | undefined, etymology: t.etymology as string | undefined, body: t.body as string | undefined,
          synonyms: synonymsFor(String(r.id), String(t.locale), "synonym"), nearTerms: synonymsFor(String(r.id), String(t.locale), "near"), aliases: synonymsFor(String(r.id), String(t.locale), "alias") })),
      })),
      philosophers: philosophers.map((r): Philosopher => ({
        id: String(r.id), ...stamps(r), featured: !!r.featured, birthYear: (r.birth_year as number | null) ?? null, deathYear: (r.death_year as number | null) ?? null,
        birthYearApprox: !!r.birth_year_approx, periodId: String(r.period_id), portrait: r.portrait_url ? { src: String(r.portrait_url), alt: String(r.portrait_alt ?? "") } : null,
        schoolIds: ids(gPhS.get(String(r.id)), "school_id"), categoryIds: ids(gPhCat.get(String(r.id)), "category_id"),
        influencedByIds: ids(gPhInf.get(String(r.id)), "influenced_by_id"), sourceIds: ids(gPhSrc.get(String(r.id)), "source_id"),
        translations: trans<PhilosopherTranslation>(gPhT.get(String(r.id)), (t) => ({ ...base(t), biography: t.biography as string | undefined, keyIdeas: (t.key_ideas as string[] | null) ?? undefined, areas: (t.areas as string[] | null) ?? undefined, aliases: (t.aliases as string[] | null) ?? undefined })),
      })),
      schools: schools.map((r): School => ({
        id: String(r.id), ...stamps(r), periodId: String(r.period_id), startYear: (r.start_year as number | null) ?? null, endYear: (r.end_year as number | null) ?? null,
        influencedByIds: ids(gSchInf.get(String(r.id)), "influenced_by_id"), relatedSchoolIds: ids(gSchRel.get(String(r.id)), "related_id"),
        translations: trans<SchoolTranslation>(gSchT.get(String(r.id)), (t) => ({ ...base(t), definition: t.definition as string | undefined, body: t.body as string | undefined, aliases: (t.aliases as string[] | null) ?? undefined })),
      })),
      categories: categories.map((r): Category => ({
        id: String(r.id), ...stamps(r), order: Number(r.sort_order ?? 0), hue: Number(r.hue ?? 220),
        translations: trans<CategoryTranslation>(gCatT.get(String(r.id)), (t) => ({ ...base(t), introduction: t.introduction as string | undefined, definition: t.definition as string | undefined, questions: (t.questions as string[] | null) ?? undefined })),
      })),
      works: works.map((r): Work => ({
        id: String(r.id), ...stamps(r), authorId: String(r.author_id), year: (r.year as number | null) ?? null, yearApprox: !!r.year_approx,
        originalTitle: String(r.original_title ?? ""), originalLanguage: String(r.original_language ?? ""),
        conceptIds: ids(gWC.get(String(r.id)), "concept_id"), sourceIds: ids(gWS.get(String(r.id)), "source_id"),
        translations: trans<WorkTranslation>(gWT.get(String(r.id)), (t) => ({ ...base(t), body: t.body as string | undefined })),
      })),
      periods: periods.map((r): Period => ({
        id: String(r.id), ...stamps(r), order: Number(r.sort_order ?? 0), startYear: Number(r.start_year), endYear: (r.end_year as number | null) ?? null,
        translations: trans<PeriodTranslation>(gPT.get(String(r.id)), (t) => ({ ...base(t), events: (t.events as string[] | null) ?? undefined })),
      })),
      sources: sources.map((r): Source => ({ id: String(r.id), type: r.type as Source["type"], authors: (r.authors as string[]) ?? [], title: String(r.title), year: (r.year as number | null) ?? null, publisher: r.publisher as string | undefined, url: r.url as string | undefined, locale: r.locale as Locale | undefined })),
    };
  }

  listConcepts = (l: Locale) => this.load().then((r) => r.listConcepts(l));
  getConcept = (l: Locale, s: string) => this.load().then((r) => r.getConcept(l, s));
  listPhilosophers = (l: Locale) => this.load().then((r) => r.listPhilosophers(l));
  getPhilosopher = (l: Locale, s: string) => this.load().then((r) => r.getPhilosopher(l, s));
  listSchools = (l: Locale) => this.load().then((r) => r.listSchools(l));
  getSchool = (l: Locale, s: string) => this.load().then((r) => r.getSchool(l, s));
  listCategories = (l: Locale) => this.load().then((r) => r.listCategories(l));
  getCategory = (l: Locale, s: string) => this.load().then((r) => r.getCategory(l, s));
  listWorks = (l: Locale) => this.load().then((r) => r.listWorks(l));
  getWork = (l: Locale, s: string) => this.load().then((r) => r.getWork(l, s));
  listPeriods = (l: Locale) => this.load().then((r) => r.listPeriods(l));
  getPeriod = (l: Locale, s: string) => this.load().then((r) => r.getPeriod(l, s));
  listSources = () => this.load().then((r) => r.listSources());
  getHomeData = (l: Locale) => this.load().then((r) => r.getHomeData(l));
  listAllSlugs = () => this.load().then((r) => r.listAllSlugs());
  getSearchDocuments = () => this.load().then((r) => r.getSearchDocuments());
}
