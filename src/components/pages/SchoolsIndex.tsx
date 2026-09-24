import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import { getRepository } from "@/lib/data";
import { formatYear } from "@/lib/utils/dates";
import { PageHeader } from "@/components/content/PageHeader";
import { Badge, Card, CardHead, CardSummary, CardTitle } from "@/components/ui";

export async function SchoolsIndex({ locale, d }: { locale: Locale; d: Dictionary }) {
  const repo = getRepository();
  const [schools, periods] = await Promise.all([repo.listSchools(locale), repo.listPeriods(locale)]);
  const periodTitle = (id: string) => periods.find((p) => p.id === id)?.t.title;
  const span = (start: number | null, end: number | null) => {
    if (start === null) return "";
    return `${formatYear(start, locale)} – ${end === null ? d.period.present : formatYear(end, locale)}`;
  };
  return (
    <>
      <PageHeader
        eyebrow={<span className="t-eyebrow">{d.entity.schools}</span>}
        title={d.school.indexTitle}
        lead={d.school.indexLead}
        crumbs={[{ label: d.nav.home, href: href(locale) }, { label: d.school.indexTitle }]}
        crumbsLabel={d.a11y.breadcrumb}
      />
      <div className="container" style={{ paddingBlock: "var(--s-10) var(--s-16)" }}>
        <ul className="grid grid--3">
          {schools.map((s) => {
            const period = periodTitle(s.periodId);
            return (
              <li key={s.id}>
                {/* Span left, period pill right: the period classifies the school. */}
                <Card>
                  <CardHead meta={span(s.startYear, s.endYear)} tag={period ? <Badge>{period}</Badge> : undefined} />
                  <CardTitle href={href(locale, "schools", s.t.slug)}>{s.t.title}</CardTitle>
                  <CardSummary>{s.t.summary}</CardSummary>
                </Card>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
