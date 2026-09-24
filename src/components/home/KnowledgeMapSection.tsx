import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import { Button } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./KnowledgeMapSection.module.css";

/** Phase-6 teaser. The relation graph already exists in the data model; this is the visual promise. */
export function KnowledgeMapSection({ locale, d }: { locale: Locale; d: Dictionary }) {
  const sample = locale === "pt" ? "liberdade" : locale === "en" ? "freedom" : locale === "fr" ? "liberte" : "freiheit";
  return (
    <section className="section container" aria-labelledby="home-graph">
      <Reveal className={styles.card}>
        <div className={styles.text}>
          <p className="t-eyebrow">Phase 6</p>
          <h2 id="home-graph" className="t-h2">{d.home.graphTitle}</h2>
          <p className="t-lead">{d.home.graphLead}</p>
          <Button href={href(locale, "concepts", sample)} variant="secondary">{d.home.graphCta}</Button>
        </div>
        <svg className={styles.graph} viewBox="0 0 320 220" aria-hidden focusable="false">
          <g stroke="currentColor" strokeWidth="1">
            <line x1="160" y1="110" x2="60" y2="50" /><line x1="160" y1="110" x2="270" y2="60" /><line x1="160" y1="110" x2="90" y2="180" />
            <line x1="160" y1="110" x2="250" y2="170" /><line x1="60" y1="50" x2="90" y2="180" /><line x1="270" y1="60" x2="250" y2="170" /><line x1="160" y1="110" x2="160" y2="20" />
          </g>
          <g fill="var(--bg)" stroke="currentColor" strokeWidth="1">
            <rect x="50" y="40" width="20" height="20" /><rect x="260" y="50" width="20" height="20" /><rect x="80" y="170" width="20" height="20" /><rect x="240" y="160" width="20" height="20" /><rect x="152" y="12" width="16" height="16" />
          </g>
          <rect x="146" y="96" width="28" height="28" fill="currentColor" />
        </svg>
      </Reveal>
    </section>
  );
}
