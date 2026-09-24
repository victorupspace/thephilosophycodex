import type { MetadataRoute } from "next";
import { locales, localeMeta } from "@/lib/i18n/config";
import { href, sectionRoutes, type SectionKind } from "@/lib/i18n/routes";
import { getRepository } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const repo = getRepository();
  const entries: MetadataRoute.Sitemap = [];
  const langs = (paths: Partial<Record<(typeof locales)[number], string>>) =>
    Object.fromEntries(Object.entries(paths).map(([l, p]) => [localeMeta[l as (typeof locales)[number]].htmlLang, absoluteUrl(p!)]));

  // Home + section indexes
  entries.push({ url: absoluteUrl(href("pt")), changeFrequency: "weekly", priority: 1, alternates: { languages: langs(Object.fromEntries(locales.map((l) => [l, href(l)]))) } });
  for (const kind of Object.keys(sectionRoutes) as SectionKind[]) {
    if (kind === "search") continue;
    for (const l of locales) {
      entries.push({ url: absoluteUrl(href(l, kind)), changeFrequency: "weekly", priority: 0.7, alternates: { languages: langs(Object.fromEntries(locales.map((x) => [x, href(x, kind)]))) } });
    }
  }

  // Entities: group per (kind, id) to attach hreflang alternates
  const slugs = await repo.listAllSlugs();
  const byKindSlug = new Map<string, typeof slugs>();
  for (const s of slugs) {
    const key = `${s.kind}`;
    if (!byKindSlug.has(key)) byKindSlug.set(key, []);
    byKindSlug.get(key)!.push(s);
  }
  for (const s of slugs) {
    entries.push({
      url: absoluteUrl(href(s.locale, s.kind, s.slug)),
      lastModified: s.updatedAt,
      changeFrequency: "monthly",
      priority: s.kind === "concepts" || s.kind === "philosophers" ? 0.8 : 0.6,
    });
  }
  return entries;
}
