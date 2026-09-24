import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeMeta, locales, type Locale } from "@/lib/i18n";
import { getRepository } from "@/lib/data";
import { SITE_NAME, siteUrl } from "@/lib/seo/site";
import { Header, type NavItem } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchProvider } from "@/components/search/SearchContext";
import { CommandPalette } from "@/components/search/CommandPalette";
import "@/styles/globals.css";

const sans = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-sans", display: "swap" });

export const revalidate = 3600;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: `${SITE_NAME} — ${d.site.tagline}`, template: `%s · ${SITE_NAME}` },
    description: d.site.description,
    applicationName: SITE_NAME,
    openGraph: { siteName: SITE_NAME, locale: localeMeta[locale].ogLocale, type: "website" },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f2ea" },
    { media: "(prefers-color-scheme: dark)", color: "#100f0d" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const d = getDictionary(locale);
  const categories = await getRepository().listCategories(locale);

  const nav: NavItem[] = [
    { kind: "explore", label: d.nav.explore },
    { kind: "philosophers", label: d.nav.philosophers },
    { kind: "concepts", label: d.nav.concepts },
    { kind: "periods", label: d.nav.timeline },
    { kind: "categories", label: d.nav.categories },
  ];

  return (
    <html lang={localeMeta[locale].htmlLang} className={`${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Applies the viewer's saved theme before first paint (no flash). Default is light. */}
        <script dangerouslySetInnerHTML={{ __html: "try{if(localStorage.getItem('codex:theme')==='dark')document.documentElement.setAttribute('data-theme','dark')}catch(e){}" }} />
      </head>
      <body>
        <a href="#main" className="skip-link">{d.nav.skipToContent}</a>
        <SearchProvider
          locale={locale}
          labels={{ search: d.search, entity: d.entity, a11y: { searchDialog: d.a11y.searchDialog, closeDialog: d.a11y.closeDialog } }}
        >
          <Header
            locale={locale}
            items={nav}
            labels={{ search: d.nav.search, language: d.a11y.languageSwitcher, menu: d.nav.menu, close: d.nav.close, openMenu: d.nav.openMenu, home: d.nav.home, mainNavigation: d.a11y.mainNavigation, theme: d.nav.theme, darkMode: d.nav.darkMode, lightMode: d.nav.lightMode }}
          />
          <main id="main" tabIndex={-1}>{children}</main>
          <Footer locale={locale} categories={categories} />
          <CommandPalette />
        </SearchProvider>
      </body>
    </html>
  );
}
