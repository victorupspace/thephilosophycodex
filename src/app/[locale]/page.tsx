import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import { getRepository } from "@/lib/data";
import { buildMetadata } from "@/lib/seo/metadata";
import { websiteJsonLd } from "@/lib/seo/json-ld";
import { JsonLd } from "@/components/content/JsonLd";
import { Hero } from "@/components/home/Hero";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { PhilosophersSection } from "@/components/home/PhilosophersSection";
import { TimelineSection } from "@/components/home/TimelineSection";
import { QuestionsSection } from "@/components/home/QuestionsSection";
import { PeriodsSection } from "@/components/home/PeriodsSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { EditorialSection } from "@/components/home/EditorialSection";
import { KnowledgeMapSection } from "@/components/home/KnowledgeMapSection";

export const revalidate = 3600;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return {
    ...buildMetadata({
      locale,
      title: `${d.site.name} — ${d.site.tagline}`,
      description: d.site.description,
      path: href(locale),
      alternates: Object.fromEntries(locales.map((l) => [l, href(l)])),
    }),
    title: { absolute: `${d.site.name} — ${d.home.heroTitle}` },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  const data = await getRepository().getHomeData(locale);

  return (
    <>
      <JsonLd data={websiteJsonLd(locale)} />
      <Hero locale={locale} d={d} />
      <CategoriesSection locale={locale} d={d} categories={data.categories} />
      <PhilosophersSection locale={locale} d={d} philosophers={data.philosophers} periods={data.periods} />
      <TimelineSection locale={locale} d={d} periods={data.periods} />
      <QuestionsSection locale={locale} d={d} />
      <PeriodsSection locale={locale} d={d} periods={data.periods} />
      <FeaturedSection locale={locale} d={d} concepts={data.featuredConcepts} />
      <EditorialSection locale={locale} d={d} concepts={data.editorialConcepts} />
      <KnowledgeMapSection locale={locale} d={d} />
    </>
  );
}
