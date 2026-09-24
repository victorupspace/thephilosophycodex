import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import { getRepository } from "@/lib/data";
import { PageHeader } from "@/components/content/PageHeader";
import { Timeline } from "@/components/timeline/Timeline";

export async function TimelinePage({ locale, d }: { locale: Locale; d: Dictionary }) {
  const periods = await getRepository().listPeriods(locale);
  return (
    <>
      <PageHeader
        eyebrow={<span className="t-eyebrow">{d.entity.periods}</span>}
        title={d.period.indexTitle}
        lead={d.period.indexLead}
        crumbs={[{ label: d.nav.home, href: href(locale) }, { label: d.period.indexTitle }]}
        crumbsLabel={d.a11y.breadcrumb}
      />
      <div className="container" style={{ paddingBlock: "var(--s-10) var(--s-20)" }}>
        <Timeline locale={locale} d={d} periods={periods} variant="full" />
      </div>
    </>
  );
}
