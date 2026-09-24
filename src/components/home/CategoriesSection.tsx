import type { CategoryView } from "@/lib/domain/types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import Link from "next/link";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { Reveal, RevealItem } from "@/components/motion/Reveal";

export function CategoriesSection({ locale, d, categories }: { locale: Locale; d: Dictionary; categories: CategoryView[] }) {
  return (
    <section className="section container" aria-labelledby="home-categories">
      <Reveal className="section-head">
        <div>
          <h2 id="home-categories" className="t-h2">{d.home.categoriesTitle}</h2>
          <p className="t-lead">{d.home.categoriesLead}</p>
        </div>
        <Link href={href(locale, "categories")} className="section-link">{d.home.seeAll}</Link>
      </Reveal>
      <Reveal as="div" stagger={0.05}>
        <ul className="grid grid--4">
          {categories.map((c) => (
            <RevealItem key={c.id} as="li" className="grid-li">
              <CategoryCard category={c} locale={locale} d={d} />
            </RevealItem>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
