import { type Locale } from "./config";
import { pt, type Dictionary } from "./dictionaries/pt";
import { en } from "./dictionaries/en";
import { fr } from "./dictionaries/fr";
import { de } from "./dictionaries/de";

const dictionaries: Record<Locale, Dictionary> = { pt, en, fr, de };

/** Synchronous: dictionaries are small, typed and bundled server-side. */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Tiny interpolation helper: t("{count} results", { count: 3 }) */
export function format(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ""));
}

export type { Dictionary, Locale };
export { locales, defaultLocale, localeMeta, isLocale, fallbackChain, LOCALE_COOKIE } from "./config";
export * from "./routes";
