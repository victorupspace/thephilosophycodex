import type { Locale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";
import type {
  Category, CategoryDetail, CategoryView, Concept, ConceptDetail, ConceptView, EntityRef, HomeData,
  Period, PeriodDetail, Philosopher, PhilosopherDetail, PhilosopherView, School, SchoolDetail, SchoolView,
  SlugEntry, Source, Work, WorkDetail, WorkView,
} from "@/lib/domain/types";
import type { SearchDocument } from "@/lib/search/types";
import { formatLifespan, formatYear } from "@/lib/utils/dates";
import * as seed from "@/data/seed";
import type { ContentRepository } from "./repository";
import { findBySlug, resolveTranslation } from "./resolve";

type Dataset = {
  concepts: Concept[];
  philosophers: Philosopher[];
  schools: School[];
  categories: Category[];
  works: Work[];
  periods: Period[];
  sources: Source[];
};

const isPublished = <T extends { status: string }>(e: T) => e.status === "published";

/**
 * In-memory repository over a dataset. Used with the bundled seed data, and
 * reusable as a pure "view builder" for any dataset loaded from elsewhere.
 */
export class SeedRepository implements ContentRepository {
  readonly source = "seed" as const;
  private readonly data: Dataset;

  constructor(dataset: Dataset = seed) {
    this.data = {
      concepts: dataset.concepts.filter(isPublished),
      philosophers: dataset.philosophers.filter(isPublished),
      schools: dataset.schools.filter(isPublished),
      categories: dataset.categories.filter(isPublished),
      works: dataset.works.filter(isPublished),
      periods: dataset.periods.filter(isPublished),
      sources: dataset.sources,
    };
  }

  /* ------------------------------------------------------------ refs */

  private conceptRef(c: Concept, locale: Locale): EntityRef | null {
    const r = resolveTranslation(c.translations, locale);
    return r && { id: c.id, kind: "concepts", title: r.t.title, slug: r.t.slug, summary: r.t.summary };
  }
  private philosopherRef(p: Philosopher, locale: Locale): EntityRef | null {
    const r = resolveTranslation(p.translations, locale);
    return r && { id: p.id, kind: "philosophers", title: r.t.title, slug: r.t.slug, summary: r.t.summary, meta: formatLifespan(p.birthYear, p.deathYear, locale, p.birthYearApprox) };
  }
  private schoolRef(s: School, locale: Locale): EntityRef | null {
    const r = resolveTranslation(s.translations, locale);
    const period = this.data.periods.find((p) => p.id === s.periodId);
    const pr = period && resolveTranslation(period.translations, locale);
    return r && { id: s.id, kind: "schools", title: r.t.title, slug: r.t.slug, summary: r.t.summary, meta: pr?.t.title };
  }
  private categoryRef(c: Category, locale: Locale): EntityRef | null {
    const r = resolveTranslation(c.translations, locale);
    return r && { id: c.id, kind: "categories", title: r.t.title, slug: r.t.slug, summary: r.t.summary, hue: c.hue };
  }
  private workRef(w: Work, locale: Locale): EntityRef | null {
    const r = resolveTranslation(w.translations, locale);
    const author = this.data.philosophers.find((p) => p.id === w.authorId);
    const ar = author && resolveTranslation(author.translations, locale);
    const year = formatYear(w.year, locale, w.yearApprox);
    return r && { id: w.id, kind: "works", title: r.t.title, slug: r.t.slug, summary: r.t.summary, meta: [ar?.t.title, year].filter(Boolean).join(" · ") };
  }
  private periodRef(p: Period, locale: Locale): EntityRef | null {
    const r = resolveTranslation(p.translations, locale);
    return r && { id: p.id, kind: "periods", title: r.t.title, slug: r.t.slug, summary: r.t.summary, meta: `${formatYear(p.startYear, locale)} – ${p.endYear === null ? "" : formatYear(p.endYear, locale)}`.trim() };
  }

  private refs<T>(items: T[], build: (item: T, locale: Locale) => EntityRef | null, locale: Locale): EntityRef[] {
    return items.map((i) => build(i, locale)).filter((r): r is EntityRef => r !== null);
  }
  private byIds<T extends { id: string }>(items: T[], ids: string[]): T[] {
    const set = new Set(ids);
    return items.filter((i) => set.has(i.id));
  }

  /* -------------------------------------------------------- concepts */

  private conceptView(c: Concept, locale: Locale): ConceptView | null {
    const r = resolveTranslation(c.translations, locale);
    return r && { kind: "concepts", id: c.id, status: c.status, featured: !!c.featured, updatedAt: c.updatedAt, t: r.t, ...r.resolution };
  }

  async listConcepts(locale: Locale): Promise<ConceptView[]> {
    return this.data.concepts
      .map((c) => this.conceptView(c, locale))
      .filter((v): v is ConceptView => v !== null)
      .sort((a, b) => a.t.title.localeCompare(b.t.title, locale));
  }

  async getConcept(locale: Locale, slug: string): Promise<ConceptDetail | null> {
    const c = findBySlug(this.data.concepts, locale, slug);
    if (!c) return null;
    const view = this.conceptView(c, locale);
    if (!view) return null;
    const relOf = (kind: Concept["relations"][number]["kind"]) =>
      this.refs(this.byIds(this.data.concepts, c.relations.filter((r) => r.kind === kind).map((r) => r.conceptId)), this.conceptRef.bind(this), locale);
    // reverse relations: concepts that list this one as related/broader/narrower
    const reverseRelated = this.data.concepts.filter((o) => o.id !== c.id && o.relations.some((r) => r.conceptId === c.id && r.kind === "related"));
    const reverseNarrower = this.data.concepts.filter((o) => o.relations.some((r) => r.conceptId === c.id && r.kind === "broader"));
    const reverseBroader = this.data.concepts.filter((o) => o.relations.some((r) => r.conceptId === c.id && r.kind === "narrower"));
    const reverseOpposite = this.data.concepts.filter((o) => o.id !== c.id && o.relations.some((r) => r.conceptId === c.id && r.kind === "opposite"));
    const dedupe = (a: EntityRef[]) => Array.from(new Map(a.map((x) => [x.id, x])).values());
    // A concept appears in one group only: broader > narrower > opposite > related.
    const broader = dedupe([...relOf("broader"), ...this.refs(reverseBroader, this.conceptRef.bind(this), locale)]);
    const taken = new Set(broader.map((r) => r.id));
    const narrower = dedupe([...relOf("narrower"), ...this.refs(reverseNarrower, this.conceptRef.bind(this), locale)]).filter((r) => !taken.has(r.id));
    narrower.forEach((r) => taken.add(r.id));
    const opposite = dedupe([...relOf("opposite"), ...this.refs(reverseOpposite, this.conceptRef.bind(this), locale)]).filter((r) => !taken.has(r.id));
    opposite.forEach((r) => taken.add(r.id));
    const related = dedupe([...relOf("related"), ...this.refs(reverseRelated, this.conceptRef.bind(this), locale)]).filter((r) => !taken.has(r.id));
    return {
      ...view,
      categories: this.refs(this.byIds(this.data.categories, c.categoryIds), this.categoryRef.bind(this), locale),
      philosophers: this.refs(this.byIds(this.data.philosophers, c.philosopherIds).sort((a, b) => (a.birthYear ?? 0) - (b.birthYear ?? 0)), this.philosopherRef.bind(this), locale),
      schools: this.refs(this.byIds(this.data.schools, c.schoolIds), this.schoolRef.bind(this), locale),
      periods: this.refs(this.byIds(this.data.periods, c.periodIds).sort((a, b) => a.order - b.order), this.periodRef.bind(this), locale),
      works: this.refs(this.byIds(this.data.works, c.workIds).sort((a, b) => (a.year ?? 0) - (b.year ?? 0)), this.workRef.bind(this), locale),
      related,
      opposite,
      broader,
      narrower,
      sources: this.byIds(this.data.sources, c.sourceIds),
    };
  }

  /* ---------------------------------------------------- philosophers */

  private philosopherView(p: Philosopher, locale: Locale): PhilosopherView | null {
    const r = resolveTranslation(p.translations, locale);
    return r && {
      kind: "philosophers", id: p.id, status: p.status, featured: !!p.featured, updatedAt: p.updatedAt,
      birthYear: p.birthYear, deathYear: p.deathYear, birthYearApprox: !!p.birthYearApprox, periodId: p.periodId, portrait: p.portrait ?? null,
      t: r.t, ...r.resolution,
    };
  }

  async listPhilosophers(locale: Locale): Promise<PhilosopherView[]> {
    return this.data.philosophers
      .slice()
      .sort((a, b) => (a.birthYear ?? 0) - (b.birthYear ?? 0))
      .map((p) => this.philosopherView(p, locale))
      .filter((v): v is PhilosopherView => v !== null);
  }

  async getPhilosopher(locale: Locale, slug: string): Promise<PhilosopherDetail | null> {
    const p = findBySlug(this.data.philosophers, locale, slug);
    if (!p) return null;
    const view = this.philosopherView(p, locale);
    if (!view) return null;
    const period = this.data.periods.find((x) => x.id === p.periodId);
    const concepts = this.data.concepts.filter((c) => c.philosopherIds.includes(p.id));
    const works = this.data.works.filter((w) => w.authorId === p.id).sort((a, b) => (a.year ?? 0) - (b.year ?? 0));
    const influenced = this.data.philosophers.filter((o) => o.influencedByIds.includes(p.id)).sort((a, b) => (a.birthYear ?? 0) - (b.birthYear ?? 0));
    return {
      ...view,
      period: period ? this.periodRef(period, locale) : null,
      schools: this.refs(this.byIds(this.data.schools, p.schoolIds), this.schoolRef.bind(this), locale),
      categories: this.refs(this.byIds(this.data.categories, p.categoryIds).sort((a, b) => a.order - b.order), this.categoryRef.bind(this), locale),
      concepts: this.refs(concepts, this.conceptRef.bind(this), locale).sort((a, b) => a.title.localeCompare(b.title, locale)),
      works: this.refs(works, this.workRef.bind(this), locale),
      influencedBy: this.refs(this.byIds(this.data.philosophers, p.influencedByIds).sort((a, b) => (a.birthYear ?? 0) - (b.birthYear ?? 0)), this.philosopherRef.bind(this), locale),
      influenced: this.refs(influenced, this.philosopherRef.bind(this), locale),
      sources: this.byIds(this.data.sources, p.sourceIds),
    };
  }

  /* --------------------------------------------------------- schools */

  private schoolView(s: School, locale: Locale): SchoolView | null {
    const r = resolveTranslation(s.translations, locale);
    return r && { kind: "schools", id: s.id, status: s.status, updatedAt: s.updatedAt, periodId: s.periodId, startYear: s.startYear, endYear: s.endYear, t: r.t, ...r.resolution };
  }

  async listSchools(locale: Locale): Promise<SchoolView[]> {
    return this.data.schools
      .slice()
      .sort((a, b) => (a.startYear ?? 0) - (b.startYear ?? 0))
      .map((s) => this.schoolView(s, locale))
      .filter((v): v is SchoolView => v !== null);
  }

  async getSchool(locale: Locale, slug: string): Promise<SchoolDetail | null> {
    const s = findBySlug(this.data.schools, locale, slug);
    if (!s) return null;
    const view = this.schoolView(s, locale);
    if (!view) return null;
    const period = this.data.periods.find((x) => x.id === s.periodId);
    const philosophers = this.data.philosophers.filter((p) => p.schoolIds.includes(s.id)).sort((a, b) => (a.birthYear ?? 0) - (b.birthYear ?? 0));
    const concepts = this.data.concepts.filter((c) => c.schoolIds.includes(s.id));
    const works = this.data.works.filter((w) => philosophers.some((p) => p.id === w.authorId)).sort((a, b) => (a.year ?? 0) - (b.year ?? 0));
    const influenced = this.data.schools.filter((o) => o.influencedByIds.includes(s.id));
    return {
      ...view,
      period: period ? this.periodRef(period, locale) : null,
      philosophers: this.refs(philosophers, this.philosopherRef.bind(this), locale),
      concepts: this.refs(concepts, this.conceptRef.bind(this), locale).sort((a, b) => a.title.localeCompare(b.title, locale)),
      works: this.refs(works, this.workRef.bind(this), locale),
      influencedBy: this.refs(this.byIds(this.data.schools, s.influencedByIds), this.schoolRef.bind(this), locale),
      influenced: this.refs(influenced, this.schoolRef.bind(this), locale),
      related: this.refs(this.byIds(this.data.schools, s.relatedSchoolIds), this.schoolRef.bind(this), locale),
    };
  }

  /* ------------------------------------------------------ categories */

  private categoryView(c: Category, locale: Locale): CategoryView | null {
    const r = resolveTranslation(c.translations, locale);
    if (!r) return null;
    const conceptCount = this.data.concepts.filter((x) => x.categoryIds.includes(c.id)).length;
    const philosopherCount = this.data.philosophers.filter((x) => x.categoryIds.includes(c.id)).length;
    return { kind: "categories", id: c.id, status: c.status, updatedAt: c.updatedAt, order: c.order, hue: c.hue, conceptCount, philosopherCount, t: r.t, ...r.resolution };
  }

  async listCategories(locale: Locale): Promise<CategoryView[]> {
    return this.data.categories
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((c) => this.categoryView(c, locale))
      .filter((v): v is CategoryView => v !== null);
  }

  async getCategory(locale: Locale, slug: string): Promise<CategoryDetail | null> {
    const c = findBySlug(this.data.categories, locale, slug);
    if (!c) return null;
    const view = this.categoryView(c, locale);
    if (!view) return null;
    const concepts = this.data.concepts.filter((x) => x.categoryIds.includes(c.id));
    const philosophers = this.data.philosophers.filter((x) => x.categoryIds.includes(c.id)).sort((a, b) => (a.birthYear ?? 0) - (b.birthYear ?? 0));
    const schoolIds = new Set([...concepts.flatMap((x) => x.schoolIds), ...philosophers.flatMap((p) => p.schoolIds)]);
    const periodIds = new Set([...concepts.flatMap((x) => x.periodIds), ...philosophers.map((p) => p.periodId)]);
    const workIds = new Set(concepts.flatMap((x) => x.workIds));
    return {
      ...view,
      concepts: this.refs(concepts, this.conceptRef.bind(this), locale).sort((a, b) => a.title.localeCompare(b.title, locale)),
      philosophers: this.refs(philosophers, this.philosopherRef.bind(this), locale),
      schools: this.refs(this.data.schools.filter((s) => schoolIds.has(s.id)).sort((a, b) => (a.startYear ?? 0) - (b.startYear ?? 0)), this.schoolRef.bind(this), locale),
      periods: this.refs(this.data.periods.filter((p) => periodIds.has(p.id)).sort((a, b) => a.order - b.order), this.periodRef.bind(this), locale),
      works: this.refs(this.data.works.filter((w) => workIds.has(w.id)).sort((a, b) => (a.year ?? 0) - (b.year ?? 0)), this.workRef.bind(this), locale),
    };
  }

  /* ----------------------------------------------------------- works */

  private workView(w: Work, locale: Locale): WorkView | null {
    const r = resolveTranslation(w.translations, locale);
    if (!r) return null;
    const author = this.data.philosophers.find((p) => p.id === w.authorId);
    return {
      kind: "works", id: w.id, status: w.status, updatedAt: w.updatedAt, year: w.year, yearApprox: !!w.yearApprox,
      originalTitle: w.originalTitle, originalLanguage: w.originalLanguage,
      author: author ? this.philosopherRef(author, locale) : null, t: r.t, ...r.resolution,
    };
  }

  async listWorks(locale: Locale): Promise<WorkView[]> {
    return this.data.works
      .slice()
      .sort((a, b) => (a.year ?? 0) - (b.year ?? 0))
      .map((w) => this.workView(w, locale))
      .filter((v): v is WorkView => v !== null);
  }

  async getWork(locale: Locale, slug: string): Promise<WorkDetail | null> {
    const w = findBySlug(this.data.works, locale, slug);
    if (!w) return null;
    const view = this.workView(w, locale);
    if (!view) return null;
    // Concepts the work lists, plus concepts whose entries cite the work.
    const citing = this.data.concepts.filter((c) => c.workIds.includes(w.id) && !w.conceptIds.includes(c.id));
    return {
      ...view,
      concepts: [
        ...this.refs(this.byIds(this.data.concepts, w.conceptIds), this.conceptRef.bind(this), locale),
        ...this.refs(citing, this.conceptRef.bind(this), locale).sort((a, b) => a.title.localeCompare(b.title, locale)),
      ],
      sources: this.byIds(this.data.sources, w.sourceIds),
    };
  }

  /* --------------------------------------------------------- periods */

  private periodDetail(p: Period, locale: Locale): PeriodDetail | null {
    const r = resolveTranslation(p.translations, locale);
    if (!r) return null;
    const philosophers = this.data.philosophers.filter((x) => x.periodId === p.id).sort((a, b) => (a.birthYear ?? 0) - (b.birthYear ?? 0));
    const schools = this.data.schools.filter((s) => s.periodId === p.id).sort((a, b) => (a.startYear ?? 0) - (b.startYear ?? 0));
    const concepts = this.data.concepts.filter((c) => c.periodIds.includes(p.id));
    const works = this.data.works.filter((w) => philosophers.some((x) => x.id === w.authorId)).sort((a, b) => (a.year ?? 0) - (b.year ?? 0));
    return {
      kind: "periods", id: p.id, status: p.status, updatedAt: p.updatedAt, order: p.order, startYear: p.startYear, endYear: p.endYear, t: r.t, ...r.resolution,
      philosophers: this.refs(philosophers, this.philosopherRef.bind(this), locale),
      schools: this.refs(schools, this.schoolRef.bind(this), locale),
      concepts: this.refs(concepts, this.conceptRef.bind(this), locale).sort((a, b) => a.title.localeCompare(b.title, locale)),
      works: this.refs(works, this.workRef.bind(this), locale),
    };
  }

  async listPeriods(locale: Locale): Promise<PeriodDetail[]> {
    return this.data.periods
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((p) => this.periodDetail(p, locale))
      .filter((v): v is PeriodDetail => v !== null);
  }

  async getPeriod(locale: Locale, slug: string): Promise<PeriodDetail | null> {
    const p = findBySlug(this.data.periods, locale, slug);
    return p ? this.periodDetail(p, locale) : null;
  }

  async listSources(): Promise<Source[]> {
    return this.data.sources.slice().sort((a, b) => a.title.localeCompare(b.title));
  }

  /* ------------------------------------------------------ aggregates */

  async getHomeData(locale: Locale): Promise<HomeData> {
    const [categories, philosophers, periods, concepts] = await Promise.all([
      this.listCategories(locale), this.listPhilosophers(locale), this.listPeriods(locale), this.listConcepts(locale),
    ]);
    const featured = concepts.filter((c) => c.featured);
    const editorial = concepts.filter((c) => c.t.definition && c.t.etymology).slice(0, 6);
    return {
      categories,
      philosophers: philosophers.filter((p) => p.featured),
      periods,
      featuredConcepts: featured.slice(0, 8),
      editorialConcepts: editorial,
    };
  }

  async listAllSlugs(): Promise<SlugEntry[]> {
    const out: SlugEntry[] = [];
    const push = (kind: SlugEntry["kind"], items: { translations: Record<string, { slug: string } | undefined>; updatedAt: string }[]) => {
      for (const item of items) for (const l of locales) {
        const tr = item.translations[l];
        if (tr) out.push({ kind, locale: l, slug: tr.slug, updatedAt: item.updatedAt });
      }
    };
    push("concepts", this.data.concepts);
    push("philosophers", this.data.philosophers);
    push("schools", this.data.schools);
    push("categories", this.data.categories);
    push("works", this.data.works);
    push("periods", this.data.periods);
    return out;
  }

  async getSearchDocuments(): Promise<SearchDocument[]> {
    const docs: SearchDocument[] = [];
    const otherTitles = (translations: Record<string, { title: string } | undefined>, locale: Locale) =>
      locales.filter((l) => l !== locale).map((l) => translations[l]?.title).filter((t): t is string => !!t);

    for (const c of this.data.concepts) for (const l of locales) {
      const t = c.translations[l];
      if (!t) continue;
      docs.push({ id: `concepts:${c.id}:${l}`, entityId: c.id, kind: "concepts", locale: l, title: t.title, slug: t.slug, summary: t.summary,
        aliases: [...(t.synonyms ?? []), ...(t.aliases ?? []), ...(t.nearTerms ?? []), ...otherTitles(c.translations, l)], weight: c.featured ? 1.15 : 1 });
    }
    for (const p of this.data.philosophers) for (const l of locales) {
      const t = p.translations[l];
      if (!t) continue;
      docs.push({ id: `philosophers:${p.id}:${l}`, entityId: p.id, kind: "philosophers", locale: l, title: t.title, slug: t.slug, summary: t.summary,
        aliases: [...(t.aliases ?? []), ...otherTitles(p.translations, l)], meta: formatLifespan(p.birthYear, p.deathYear, l, p.birthYearApprox), weight: p.featured ? 1.1 : 1 });
    }
    for (const s of this.data.schools) for (const l of locales) {
      const t = s.translations[l];
      if (!t) continue;
      docs.push({ id: `schools:${s.id}:${l}`, entityId: s.id, kind: "schools", locale: l, title: t.title, slug: t.slug, summary: t.summary,
        aliases: [...(t.aliases ?? []), ...otherTitles(s.translations, l)], weight: 0.95 });
    }
    for (const c of this.data.categories) for (const l of locales) {
      const t = c.translations[l];
      if (!t) continue;
      docs.push({ id: `categories:${c.id}:${l}`, entityId: c.id, kind: "categories", locale: l, title: t.title, slug: t.slug, summary: t.summary,
        aliases: otherTitles(c.translations, l), hue: c.hue, weight: 0.9 });
    }
    for (const w of this.data.works) for (const l of locales) {
      const t = w.translations[l];
      if (!t) continue;
      const author = this.data.philosophers.find((p) => p.id === w.authorId);
      const at = author && resolveTranslation(author.translations, l)?.t.title;
      docs.push({ id: `works:${w.id}:${l}`, entityId: w.id, kind: "works", locale: l, title: t.title, slug: t.slug, summary: t.summary,
        aliases: [w.originalTitle, ...otherTitles(w.translations, l)], meta: [at, formatYear(w.year, l, w.yearApprox)].filter(Boolean).join(" · "), weight: 0.85 });
    }
    for (const p of this.data.periods) for (const l of locales) {
      const t = p.translations[l];
      if (!t) continue;
      docs.push({ id: `periods:${p.id}:${l}`, entityId: p.id, kind: "periods", locale: l, title: t.title, slug: t.slug, summary: t.summary,
        aliases: otherTitles(p.translations, l), weight: 0.8 });
    }
    return docs;
  }
}
