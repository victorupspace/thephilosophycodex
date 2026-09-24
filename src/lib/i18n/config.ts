export const locales = ["pt", "en", "fr", "de"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt";

/** Fallback chain used when a translation is missing. */
export const fallbackChain: Record<Locale, Locale[]> = {
  pt: ["pt", "en"],
  en: ["en", "pt"],
  fr: ["fr", "en", "pt"],
  de: ["de", "en", "pt"],
};

export const localeMeta: Record<
  Locale,
  { label: string; nativeLabel: string; htmlLang: string; ogLocale: string; short: string }
> = {
  pt: { label: "Portuguese", nativeLabel: "Português", htmlLang: "pt-BR", ogLocale: "pt_BR", short: "PT" },
  en: { label: "English", nativeLabel: "English", htmlLang: "en", ogLocale: "en_US", short: "EN" },
  fr: { label: "French", nativeLabel: "Français", htmlLang: "fr", ogLocale: "fr_FR", short: "FR" },
  de: { label: "German", nativeLabel: "Deutsch", htmlLang: "de", ogLocale: "de_DE", short: "DE" },
};

export const LOCALE_COOKIE = "codex_locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
