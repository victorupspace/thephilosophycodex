import type { Locale } from "@/lib/i18n/config";
import type {
  CategoryDetail, CategoryView, ConceptDetail, ConceptView, HomeData, PeriodDetail,
  PhilosopherDetail, PhilosopherView, SchoolDetail, SchoolView, SlugEntry, Source, WorkDetail, WorkView,
  Concept, Philosopher, School, Category, Work, Period, ContentStatus,
} from "@/lib/domain/types";
import type { SearchDocument } from "@/lib/search/types";

/**
 * Read-side contract. Pages and components only ever talk to this interface.
 * Implementations: SeedRepository (bundled demo data) and SupabaseRepository.
 */
export interface ContentRepository {
  readonly source: "seed" | "supabase";

  listConcepts(locale: Locale): Promise<ConceptView[]>;
  getConcept(locale: Locale, slug: string): Promise<ConceptDetail | null>;

  listPhilosophers(locale: Locale): Promise<PhilosopherView[]>;
  getPhilosopher(locale: Locale, slug: string): Promise<PhilosopherDetail | null>;

  listSchools(locale: Locale): Promise<SchoolView[]>;
  getSchool(locale: Locale, slug: string): Promise<SchoolDetail | null>;

  listCategories(locale: Locale): Promise<CategoryView[]>;
  getCategory(locale: Locale, slug: string): Promise<CategoryDetail | null>;

  listWorks(locale: Locale): Promise<WorkView[]>;
  getWork(locale: Locale, slug: string): Promise<WorkDetail | null>;

  listPeriods(locale: Locale): Promise<PeriodDetail[]>;
  getPeriod(locale: Locale, slug: string): Promise<PeriodDetail | null>;

  listSources(): Promise<Source[]>;

  getHomeData(locale: Locale): Promise<HomeData>;

  /** Every published (kind, locale, slug) – sitemap and generateStaticParams. */
  listAllSlugs(): Promise<SlugEntry[]>;

  /** Flattened documents for the search index. */
  getSearchDocuments(): Promise<SearchDocument[]>;
}

export type AdminEntityKind = "concepts" | "philosophers" | "schools" | "categories" | "works" | "periods";

export type AdminEntity = Concept | Philosopher | School | Category | Work | Period;

export interface AdminListItem {
  id: string;
  kind: AdminEntityKind;
  title: string;
  slug: string;
  status: ContentStatus;
  locales: Locale[];
  updatedAt: string;
}

/**
 * Write-side contract used by the backoffice. Seed implementation is read-only
 * (throws on writes); Supabase implementation persists to Postgres.
 */
export interface AdminRepository {
  readonly writable: boolean;
  list(kind: AdminEntityKind): Promise<AdminListItem[]>;
  get(kind: AdminEntityKind, id: string): Promise<AdminEntity | null>;
  upsert(kind: AdminEntityKind, entity: AdminEntity): Promise<AdminEntity>;
  setStatus(kind: AdminEntityKind, id: string, status: ContentStatus): Promise<void>;
  remove(kind: AdminEntityKind, id: string): Promise<void>;
  counts(): Promise<Record<AdminEntityKind, { total: number; published: number; draft: number; review: number }>>;
}
