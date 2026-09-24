import type { ConceptView } from "@/lib/domain/types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { ConceptCard } from "@/components/concepts/ConceptCard";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import styles from "./EditorialSection.module.css";

export function EditorialSection({ locale, d, concepts }: { locale: Locale; d: Dictionary; concepts: ConceptView[] }) {
  if (!concepts.length) return null;
  return (
    <section className={`section ${styles.section}`} aria-labelledby="home-editorial">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <h2 id="home-editorial" className="t-h2">{d.home.editorialTitle}</h2>
            <p className="t-lead">{d.home.editorialLead}</p>
          </div>
        </Reveal>
        <Reveal stagger={0.06}>
          <ul className="grid grid--3">
            {concepts.map((c) => (
              <RevealItem key={c.id} as="li" className="grid-li"><ConceptCard c={c} locale={locale} d={d} editorial /></RevealItem>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
