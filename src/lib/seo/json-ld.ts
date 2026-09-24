import type { Locale } from "@/lib/i18n/config";
import { localeMeta } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import type { ConceptDetail, PhilosopherDetail, SchoolDetail, CategoryDetail, WorkDetail } from "@/lib/domain/types";
import { absoluteUrl, SITE_NAME } from "./site";

type JsonLd = Record<string, unknown>;

export function websiteJsonLd(locale: Locale): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl(href(locale)),
    inLanguage: localeMeta[locale].htmlLang,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${absoluteUrl(href(locale, "search"))}?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

export function conceptJsonLd(c: ConceptDetail): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: c.t.title,
    description: c.t.definition ?? c.t.summary,
    url: absoluteUrl(href(c.locale, "concepts", c.t.slug)),
    inLanguage: localeMeta[c.resolvedLocale].htmlLang,
    inDefinedTermSet: { "@type": "DefinedTermSet", name: `${SITE_NAME} — Concepts`, url: absoluteUrl(href(c.locale, "concepts")) },
    ...(c.t.synonyms?.length ? { alternateName: c.t.synonyms } : {}),
  };
}

export function philosopherJsonLd(p: PhilosopherDetail): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.t.title,
    description: p.t.summary,
    url: absoluteUrl(href(p.locale, "philosophers", p.t.slug)),
    ...(p.birthYear !== null ? { birthDate: String(p.birthYear) } : {}),
    ...(p.deathYear !== null ? { deathDate: String(p.deathYear) } : {}),
    jobTitle: "Philosopher",
    knowsAbout: p.concepts.map((c) => c.title),
  };
}

export function collectionJsonLd(entity: SchoolDetail | CategoryDetail, kind: "schools" | "categories"): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: entity.t.title,
    description: entity.t.summary,
    url: absoluteUrl(href(entity.locale, kind, entity.t.slug)),
    inLanguage: localeMeta[entity.resolvedLocale].htmlLang,
  };
}

export function workJsonLd(w: WorkDetail): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: w.t.title,
    alternateName: w.originalTitle,
    description: w.t.summary,
    url: absoluteUrl(href(w.locale, "works", w.t.slug)),
    ...(w.author ? { author: { "@type": "Person", name: w.author.title, url: absoluteUrl(href(w.locale, "philosophers", w.author.slug)) } } : {}),
    ...(w.year !== null ? { datePublished: String(w.year) } : {}),
  };
}
