import { type Locale, locales } from "./config";

/**
 * Entity kinds that have their own section (index + detail pages).
 */
export const entityKinds = ["concepts", "philosophers", "schools", "categories", "works", "periods"] as const;
export type EntityKind = (typeof entityKinds)[number];

/**
 * Page kinds that live under a localized section but have no slug children.
 */
export const pageKinds = ["explore", "search", "about", "methodology", "sources", "contact"] as const;
export type PageKind = (typeof pageKinds)[number];

export type SectionKind = EntityKind | PageKind;

/** Localized URL segments. Keep them short, lowercase, ASCII (SEO + shareability). */
export const sectionRoutes: Record<SectionKind, Record<Locale, string>> = {
  concepts: { pt: "conceitos", en: "concepts", fr: "concepts", de: "begriffe" },
  philosophers: { pt: "filosofos", en: "philosophers", fr: "philosophes", de: "philosophen" },
  schools: { pt: "escolas", en: "schools", fr: "ecoles", de: "schulen" },
  categories: { pt: "categorias", en: "categories", fr: "categories", de: "kategorien" },
  works: { pt: "obras", en: "works", fr: "oeuvres", de: "werke" },
  periods: { pt: "cronologia", en: "timeline", fr: "chronologie", de: "chronologie" },
  explore: { pt: "explorar", en: "explore", fr: "explorer", de: "entdecken" },
  search: { pt: "pesquisa", en: "search", fr: "recherche", de: "suche" },
  about: { pt: "sobre", en: "about", fr: "a-propos", de: "ueber" },
  methodology: { pt: "metodologia", en: "methodology", fr: "methodologie", de: "methodik" },
  sources: { pt: "fontes", en: "sources", fr: "sources", de: "quellen" },
  contact: { pt: "contato", en: "contact", fr: "contact", de: "kontakt" },
};

const reverseIndex: Record<Locale, Record<string, SectionKind>> = locales.reduce(
  (acc, locale) => {
    acc[locale] = {};
    for (const kind of Object.keys(sectionRoutes) as SectionKind[]) {
      acc[locale][sectionRoutes[kind][locale]] = kind;
    }
    return acc;
  },
  {} as Record<Locale, Record<string, SectionKind>>,
);

export function resolveSection(locale: Locale, segment: string): SectionKind | null {
  return reverseIndex[locale][segment] ?? null;
}

export function isEntityKind(kind: SectionKind): kind is EntityKind {
  return (entityKinds as readonly string[]).includes(kind);
}

/** Build a localized href. `href(locale)` → home, `href(locale, 'concepts')` → index, `href(locale, 'concepts', slug)` → detail. */
export function href(locale: Locale, kind?: SectionKind, slug?: string, query?: Record<string, string>): string {
  let path = `/${locale}`;
  if (kind) path += `/${sectionRoutes[kind][locale]}`;
  if (slug) path += `/${slug}`;
  if (query) {
    const qs = new URLSearchParams(query).toString();
    if (qs) path += `?${qs}`;
  }
  return path;
}

/** All localized section segments for a locale (used by generateStaticParams). */
export function sectionSegmentsFor(locale: Locale): string[] {
  return Object.values(reverseIndex[locale] ? Object.keys(reverseIndex[locale]) : []);
}
