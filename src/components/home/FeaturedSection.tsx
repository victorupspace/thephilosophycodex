import type { ConceptView } from "@/lib/domain/types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import Link from "next/link";
import { ConceptCard } from "@/components/concepts/ConceptCard";
import { Reveal, RevealItem } from "@/components/motion/Reveal";

export function FeaturedSection({ locale, d, concepts }: { locale: Locale; d: Dictionary; concepts: ConceptView[] }) {
  return (
    <section className="section container" aria-labelledby="home-featured">
      <Reveal className="section-head">
        <div>
          <h2 id="home-featured" className="t-h2">{d.home.featuredTitle}</h2>
          <p className="t-lead">{d.home.featuredLead}</p>
        </div>
        <Link href={href(locale, "concepts")} className="section-link">{d.home.seeAll}</Link>
      </Reveal>
      <Reveal stagger={0.05}>
        <ul className="grid grid--4">
          {concepts.map((c) => (
            <RevealItem key={c.id} as="li" className="grid-li"><ConceptCard c={c} locale={locale} d={d} /></RevealItem>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
