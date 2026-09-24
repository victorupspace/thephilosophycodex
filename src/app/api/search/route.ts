import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { entityKinds, type EntityKind } from "@/lib/i18n/routes";
import { getSearchProvider } from "@/lib/search";

export const dynamic = "force-dynamic";

/**
 * GET /api/search?q=&locale=&kinds=concepts,philosophers&limit=
 * Autocomplete endpoint. Cached at the edge for a minute (results are deterministic per query).
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const q = (sp.get("q") ?? "").slice(0, 120);
  const localeParam = sp.get("locale");
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const limit = Math.min(Math.max(parseInt(sp.get("limit") ?? "10", 10) || 10, 1), 50);
  const kinds = (sp.get("kinds") ?? "").split(",").filter((k): k is EntityKind => (entityKinds as readonly string[]).includes(k));

  if (q.trim().length < 1) {
    return NextResponse.json({ query: q, results: [], total: 0, tookMs: 0 }, { headers: { "Cache-Control": "public, max-age=60" } });
  }
  const provider = await getSearchProvider();
  const response = await provider.search({ q, locale, kinds: kinds.length ? kinds : undefined, limit });
  return NextResponse.json(response, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300", "X-Search-Provider": provider.name },
  });
}
