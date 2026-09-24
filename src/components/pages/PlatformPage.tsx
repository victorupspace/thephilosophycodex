import type { Dictionary, Locale } from "@/lib/i18n";
import { href, type PageKind } from "@/lib/i18n/routes";
import { getRepository } from "@/lib/data";
import { PageHeader } from "@/components/content/PageHeader";
import { CitationList } from "@/components/ui";
import { RichText } from "@/components/content/RichText";

type Kind = Extract<PageKind, "about" | "methodology" | "sources" | "contact">;

export async function PlatformPage({ locale, d, kind }: { locale: Locale; d: Dictionary; kind: Kind }) {
  const page = d.pages[kind];
  const sources = kind === "sources" ? await getRepository().listSources() : [];
  return (
    <>
      <PageHeader title={page.title} lead={page.lead} crumbs={[{ label: d.nav.home, href: href(locale) }, { label: page.title }]} crumbsLabel={d.a11y.breadcrumb} />
      <div className="container container--narrow" style={{ paddingBlock: "var(--s-12) var(--s-20)", display: "grid", gap: "var(--s-10)" }}>
        <RichText body={page.body} />
        {kind === "sources" && <CitationList sources={sources} />}
        {kind === "contact" && (
          <p className="t-body">
            <a href="mailto:editorial@thecodex.example" className="t-accent">editorial@thecodex.example</a>
          </p>
        )}
      </div>
    </>
  );
}
