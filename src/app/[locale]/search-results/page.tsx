import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import { buildMetadata, sectionAlternates } from "@/lib/seo/metadata";
import { SearchPage } from "@/components/pages/SearchPage";

/**
 * Internal target for the localized search URL (/pt/pesquisa, /en/search, …).
 * The proxy rewrites those paths here so that the static [section] route never
 * touches searchParams. This is the only dynamic content route.
 */
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return buildMetadata({ locale, title: d.search.pageTitle, description: d.search.hint, path: href(locale, "search"), alternates: sectionAlternates("search"), noIndex: true });
}

export default async function SearchRoute({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <SearchPage locale={locale} d={getDictionary(locale)} searchParams={await searchParams} />;
}
