import type { Metadata } from "next";
import { type Locale, localeMeta, locales } from "@/lib/i18n/config";
import { href, type SectionKind } from "@/lib/i18n/routes";
import { truncate } from "@/lib/utils/text";
import { absoluteUrl, SITE_NAME } from "./site";

interface PageMeta {
  locale: Locale;
  title: string;
  description: string;
  /** Path for this locale (canonical). */
  path: string;
  /** Equivalent paths in other locales, for hreflang. Missing locales are omitted. */
  alternates?: Partial<Record<Locale, string>>;
  type?: "website" | "article";
  noIndex?: boolean;
}

export function buildMetadata({ locale, title, description, path, alternates, type = "website", noIndex }: PageMeta): Metadata {
  const languages: Record<string, string> = {};
  if (alternates) {
    for (const l of locales) {
      const p = alternates[l];
      if (p) languages[localeMeta[l].htmlLang] = absoluteUrl(p);
    }
    const def = alternates.pt ?? alternates.en;
    if (def) languages["x-default"] = absoluteUrl(def);
  }
  const desc = truncate(description, 158);
  return {
    title,
    description: desc,
    alternates: { canonical: absoluteUrl(path), languages: Object.keys(languages).length ? languages : undefined },
    openGraph: {
      type,
      siteName: SITE_NAME,
      title,
      description: desc,
      url: absoluteUrl(path),
      locale: localeMeta[locale].ogLocale,
      alternateLocale: locales.filter((l) => l !== locale && alternates?.[l]).map((l) => localeMeta[l].ogLocale),
    },
    twitter: { card: "summary_large_image", title, description: desc },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

/** Alternates for a section index page (same section, every locale). */
export function sectionAlternates(kind: SectionKind): Partial<Record<Locale, string>> {
  return Object.fromEntries(locales.map((l) => [l, href(l, kind)]));
}

/** Alternates for an entity page from its per-locale slugs. */
export function entityAlternates(kind: SectionKind, slugs: Partial<Record<Locale, string>>): Partial<Record<Locale, string>> {
  const out: Partial<Record<Locale, string>> = {};
  for (const l of locales) if (slugs[l]) out[l] = href(l, kind, slugs[l]);
  return out;
}
