import { fallbackChain, type Locale, locales } from "@/lib/i18n/config";
import type { BaseTranslation, LocaleResolution, Translations } from "@/lib/domain/types";

/**
 * Pick the best translation for `locale`, following the fallback chain.
 * Returns null when the entity has no translation at all.
 */
export function resolveTranslation<T extends BaseTranslation>(
  translations: Translations<T>,
  locale: Locale,
): { t: T; resolution: LocaleResolution } | null {
  let resolvedLocale: Locale | null = null;
  for (const candidate of fallbackChain[locale]) {
    if (translations[candidate]) {
      resolvedLocale = candidate;
      break;
    }
  }
  if (!resolvedLocale) {
    const any = locales.find((l) => translations[l]);
    if (!any) return null;
    resolvedLocale = any;
  }
  const t = translations[resolvedLocale] as T;
  const alternates: Partial<Record<Locale, string>> = {};
  const titles: Partial<Record<Locale, string>> = {};
  for (const l of locales) {
    const tr = translations[l];
    if (tr) {
      alternates[l] = tr.slug;
      titles[l] = tr.title;
    }
  }
  return {
    t,
    resolution: { locale, resolvedLocale, isFallback: resolvedLocale !== locale, alternates, titles },
  };
}

/** Find the entity whose translation in `locale` (or any locale, as fallback for old links) has `slug`. */
export function findBySlug<E extends { translations: Translations<BaseTranslation> }>(
  entities: E[],
  locale: Locale,
  slug: string,
): E | undefined {
  return (
    entities.find((e) => e.translations[locale]?.slug === slug) ??
    entities.find((e) => locales.some((l) => e.translations[l]?.slug === slug))
  );
}
