import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import { getRepository } from "@/lib/data";
import { PageHeader } from "@/components/content/PageHeader";
import { CategoryCard } from "@/components/categories/CategoryCard";

export async function CategoriesIndex({ locale, d }: { locale: Locale; d: Dictionary }) {
  const categories = await getRepository().listCategories(locale);
  return (
    <>
      <PageHeader
        eyebrow={<span className="t-eyebrow">{d.entity.categories}</span>}
        title={d.category.indexTitle}
        lead={d.category.indexLead}
        crumbs={[{ label: d.nav.home, href: href(locale) }, { label: d.category.indexTitle }]}
        crumbsLabel={d.a11y.breadcrumb}
      />
      <div className="container" style={{ paddingBlock: "var(--s-10) var(--s-16)" }}>
        <ul className="grid grid--3">
          {categories.map((c) => <li key={c.id}><CategoryCard category={c} locale={locale} d={d} large /></li>)}
        </ul>
      </div>
    </>
  );
}
