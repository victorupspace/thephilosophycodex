import type { Locale } from "@/lib/i18n/config";
import type { EntityKind } from "@/lib/i18n/routes";

/* ------------------------------------------------------------------ */
/* Workflow                                                            */
/* ------------------------------------------------------------------ */

export type ContentStatus = "draft" | "review" | "published";

export interface Timestamps {
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

/* ------------------------------------------------------------------ */
/* Translations                                                        */
/* ------------------------------------------------------------------ */

export interface BaseTranslation {
  title: string;
  slug: string;
  summary: string;
  seoTitle?: string;
  seoDescription?: string;
}

export type Translations<T extends BaseTranslation> = Partial<Record<Locale, T>>;

export interface ConceptTranslation extends BaseTranslation {
  /** Short, objective definition (1–2 sentences). */
  definition?: string;
  etymology?: string;
  /** Long-form editorial body, Markdown-lite (paragraphs separated by blank lines). */
  body?: string;
  synonyms?: string[];
  nearTerms?: string[];
  /** Alternate spellings / search aliases (not displayed). */
  aliases?: string[];
}

export interface PhilosopherTranslation extends BaseTranslation {
  biography?: string;
  keyIdeas?: string[];
  areas?: string[];
  aliases?: string[];
}

export interface SchoolTranslation extends BaseTranslation {
  definition?: string;
  body?: string;
  aliases?: string[];
}

export interface CategoryTranslation extends BaseTranslation {
  introduction?: string;
  definition?: string;
  questions?: string[];
}

export interface WorkTranslation extends BaseTranslation {
  body?: string;
}

export interface PeriodTranslation extends BaseTranslation {
  events?: string[];
}

/* ------------------------------------------------------------------ */
/* Entities (storage shape — mirrors the SQL schema)                   */
/* ------------------------------------------------------------------ */

export type ConceptRelationKind = "related" | "opposite" | "broader" | "narrower";

export interface ConceptRelation {
  conceptId: string;
  kind: ConceptRelationKind;
}

export interface Concept extends Timestamps {
  id: string;
  status: ContentStatus;
  featured?: boolean;
  categoryIds: string[];
  philosopherIds: string[];
  schoolIds: string[];
  periodIds: string[];
  workIds: string[];
  sourceIds: string[];
  relations: ConceptRelation[];
  translations: Translations<ConceptTranslation>;
}

export interface Philosopher extends Timestamps {
  id: string;
  status: ContentStatus;
  featured?: boolean;
  /** Negative years are BCE. */
  birthYear: number | null;
  deathYear: number | null;
  birthYearApprox?: boolean;
  periodId: string;
  schoolIds: string[];
  categoryIds: string[];
  /** Philosophers this one was influenced by. The reverse ("influenced") is derived. */
  influencedByIds: string[];
  sourceIds: string[];
  portrait?: { src: string; alt: string } | null;
  translations: Translations<PhilosopherTranslation>;
}

export interface School extends Timestamps {
  id: string;
  status: ContentStatus;
  periodId: string;
  startYear: number | null;
  endYear: number | null;
  /** Schools that influenced this one. */
  influencedByIds: string[];
  relatedSchoolIds: string[];
  translations: Translations<SchoolTranslation>;
}

export interface Category extends Timestamps {
  id: string;
  status: ContentStatus;
  order: number;
  /** Design token hue used for the card accent (0–360). */
  hue: number;
  translations: Translations<CategoryTranslation>;
}

export interface Work extends Timestamps {
  id: string;
  status: ContentStatus;
  authorId: string;
  year: number | null;
  yearApprox?: boolean;
  originalTitle: string;
  originalLanguage: string;
  conceptIds: string[];
  sourceIds: string[];
  translations: Translations<WorkTranslation>;
}

export interface Period extends Timestamps {
  id: string;
  status: ContentStatus;
  order: number;
  startYear: number;
  endYear: number | null;
  translations: Translations<PeriodTranslation>;
}

export type SourceType = "book" | "article" | "encyclopedia" | "web";

export interface Source {
  id: string;
  type: SourceType;
  authors: string[];
  title: string;
  year: number | null;
  publisher?: string;
  url?: string;
  locale?: Locale;
}

/* ------------------------------------------------------------------ */
/* Locale-resolved views (what pages consume)                          */
/* ------------------------------------------------------------------ */

export interface LocaleResolution {
  locale: Locale;
  resolvedLocale: Locale;
  isFallback: boolean;
  /** slug per locale, used for hreflang + language switcher. */
  alternates: Partial<Record<Locale, string>>;
  /** title per locale, used for "in other languages". */
  titles: Partial<Record<Locale, string>>;
}

export interface EntityRef {
  id: string;
  kind: EntityKind;
  title: string;
  slug: string;
  summary?: string;
  /** Short metadata line, e.g. "1724–1804" or "Antiquity". */
  meta?: string;
  hue?: number;
}

export interface ConceptView extends LocaleResolution {
  kind: "concepts";
  id: string;
  status: ContentStatus;
  featured: boolean;
  updatedAt: string;
  t: ConceptTranslation;
}

export interface ConceptDetail extends ConceptView {
  categories: EntityRef[];
  philosophers: EntityRef[];
  schools: EntityRef[];
  periods: EntityRef[];
  works: EntityRef[];
  related: EntityRef[];
  opposite: EntityRef[];
  broader: EntityRef[];
  narrower: EntityRef[];
  sources: Source[];
}

export interface PhilosopherView extends LocaleResolution {
  kind: "philosophers";
  id: string;
  status: ContentStatus;
  featured: boolean;
  updatedAt: string;
  birthYear: number | null;
  deathYear: number | null;
  birthYearApprox: boolean;
  periodId: string;
  portrait: { src: string; alt: string } | null;
  t: PhilosopherTranslation;
}

export interface PhilosopherDetail extends PhilosopherView {
  period: EntityRef | null;
  schools: EntityRef[];
  categories: EntityRef[];
  concepts: EntityRef[];
  works: EntityRef[];
  influencedBy: EntityRef[];
  influenced: EntityRef[];
  sources: Source[];
}

export interface SchoolView extends LocaleResolution {
  kind: "schools";
  id: string;
  status: ContentStatus;
  updatedAt: string;
  periodId: string;
  startYear: number | null;
  endYear: number | null;
  t: SchoolTranslation;
}

export interface SchoolDetail extends SchoolView {
  period: EntityRef | null;
  philosophers: EntityRef[];
  concepts: EntityRef[];
  works: EntityRef[];
  influencedBy: EntityRef[];
  influenced: EntityRef[];
  related: EntityRef[];
}

export interface CategoryView extends LocaleResolution {
  kind: "categories";
  id: string;
  status: ContentStatus;
  updatedAt: string;
  order: number;
  hue: number;
  conceptCount: number;
  philosopherCount: number;
  t: CategoryTranslation;
}

export interface CategoryDetail extends CategoryView {
  concepts: EntityRef[];
  philosophers: EntityRef[];
  schools: EntityRef[];
  periods: EntityRef[];
  works: EntityRef[];
}

export interface WorkView extends LocaleResolution {
  kind: "works";
  id: string;
  status: ContentStatus;
  updatedAt: string;
  year: number | null;
  yearApprox: boolean;
  originalTitle: string;
  originalLanguage: string;
  author: EntityRef | null;
  t: WorkTranslation;
}

export interface WorkDetail extends WorkView {
  concepts: EntityRef[];
  sources: Source[];
}

export interface PeriodView extends LocaleResolution {
  kind: "periods";
  id: string;
  status: ContentStatus;
  updatedAt: string;
  order: number;
  startYear: number;
  endYear: number | null;
  t: PeriodTranslation;
}

export interface PeriodDetail extends PeriodView {
  philosophers: EntityRef[];
  schools: EntityRef[];
  concepts: EntityRef[];
  works: EntityRef[];
}

export type AnyView = ConceptView | PhilosopherView | SchoolView | CategoryView | WorkView | PeriodView;

/* ------------------------------------------------------------------ */
/* Aggregates                                                          */
/* ------------------------------------------------------------------ */

export interface HomeData {
  categories: CategoryView[];
  philosophers: PhilosopherView[];
  periods: PeriodDetail[];
  featuredConcepts: ConceptView[];
  editorialConcepts: ConceptView[];
}

export interface SlugEntry {
  kind: EntityKind;
  locale: Locale;
  slug: string;
  updatedAt: string;
}
