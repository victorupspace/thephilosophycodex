import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE, locales, type Locale } from "@/lib/i18n/config";
import { sectionRoutes } from "@/lib/i18n/routes";

function negotiateLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookie)) return cookie;
  const header = request.headers.get("accept-language") ?? "";
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Backoffice: optimistic gate. Real authorization happens in the admin layout.
  if (pathname.startsWith("/admin")) {
    const supabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseConfigured && process.env.NODE_ENV === "production") {
      return new NextResponse(null, { status: 404 });
    }
    return NextResponse.next();
  }

  const current = locales.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (current) {
    // Localized search URL → internal dynamic route (keeps every [section] page static).
    if (pathname === `/${current}/${sectionRoutes.search[current]}`) {
      const url = request.nextUrl.clone();
      url.pathname = `/${current}/search-results`;
      return NextResponse.rewrite(url);
    }
    // Direct hits on the internal route get the canonical localized URL.
    if (pathname === `/${current}/search-results`) {
      const url = request.nextUrl.clone();
      url.pathname = `/${current}/${sectionRoutes.search[current]}`;
      return NextResponse.redirect(url, 308);
    }
    return NextResponse.next();
  }

  const locale = negotiateLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: ["/((?!api|_next|sitemap\\.xml|robots\\.txt|favicon\\.ico|icon|apple-icon|opengraph-image|manifest|.*\\..*).*)"],
};
