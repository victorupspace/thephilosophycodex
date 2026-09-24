import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import styles from "./QuestionsSection.module.css";

export function QuestionsSection({ locale, d }: { locale: Locale; d: Dictionary }) {
  return (
    <section className={`section ${styles.section}`} aria-labelledby="home-questions">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <h2 id="home-questions" className="t-h2">{d.home.questionsTitle}</h2>
            <p className="t-lead">{d.home.questionsLead}</p>
          </div>
        </Reveal>
        <Reveal stagger={0.06}>
          <ul className={styles.list}>
            {d.home.questions.map((q) => (
              <RevealItem key={q.q} as="li" className={styles.item}>
                <Link href={href(locale, "concepts", q.concept)} className={styles.link}>
                  <span className={styles.q}>{q.q}</span>
                  <ArrowRight size={20} className={styles.arrow} aria-hidden />
                </Link>
              </RevealItem>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
