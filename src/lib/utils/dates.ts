import type { Locale } from "@/lib/i18n/config";

const eraLabels: Record<Locale, { bce: string; ce: string; approx: string }> = {
  pt: { bce: "a.C.", ce: "d.C.", approx: "c." },
  en: { bce: "BCE", ce: "CE", approx: "c." },
  fr: { bce: "av. J.-C.", ce: "apr. J.-C.", approx: "v." },
  de: { bce: "v. Chr.", ce: "n. Chr.", approx: "ca." },
};

/** Format a possibly-negative year with era markers. Years ≥ 1000 CE omit the era suffix. */
export function formatYear(year: number | null, locale: Locale, approx = false): string {
  if (year === null) return "";
  const l = eraLabels[locale];
  const prefix = approx ? `${l.approx} ` : "";
  if (year < 0) return `${prefix}${Math.abs(year)} ${l.bce}`;
  if (year < 1000) return `${prefix}${year} ${l.ce}`;
  return `${prefix}${year}`;
}

export function formatLifespan(birth: number | null, death: number | null, locale: Locale, approx = false): string {
  const b = formatYear(birth, locale, approx);
  const d = formatYear(death, locale);
  if (!b && !d) return "";
  return `${b}–${d}`;
}

export function formatSpan(start: number, end: number | null, locale: Locale, presentLabel: string): string {
  return `${formatYear(start, locale)} – ${end === null ? presentLabel : formatYear(end, locale)}`;
}

export function formatDate(iso: string, locale: Locale): string {
  const map: Record<Locale, string> = { pt: "pt-BR", en: "en-GB", fr: "fr-FR", de: "de-DE" };
  return new Intl.DateTimeFormat(map[locale], { year: "numeric", month: "long", day: "numeric" }).format(new Date(iso));
}
