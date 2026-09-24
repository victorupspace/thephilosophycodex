import Link from "next/link";
import type { PeriodDetail } from "@/lib/domain/types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import { formatSpan } from "@/lib/utils/dates";
import { TimelineScroll } from "./TimelineScroll";
import styles from "./Timeline.module.css";

interface Props { locale: Locale; d: Dictionary; periods: PeriodDetail[]; variant?: "strip" | "full"; currentId?: string }

/**
 * Chronology. "strip": compact horizontal rail (home). "full": vertical
 * chapters with philosophers/schools/works per period (timeline page).
 * Server-rendered; GSAP progress line is enhanced client-side.
 */
export function Timeline({ locale, d, periods, variant = "strip", currentId }: Props) {
  if (variant === "full") {
    return (
      <TimelineScroll className={styles.full} variant="full">
        <ol className={styles.fullList} aria-label={d.a11y.timeline}>
          {periods.map((p, i) => (
            <li key={p.id} id={p.t.slug} className={styles.chapter} data-current={p.id === currentId} data-tl-item>
              <div className={styles.chapterRail} aria-hidden>
                <span className={styles.node} data-tl-node />
              </div>
              <div className={styles.chapterBody}>
                <p className="t-meta">{String(i + 1).padStart(2, "0")} · {formatSpan(p.startYear, p.endYear, locale, d.period.present)}</p>
                <h2 className={`t-h2 ${styles.chapterTitle}`}>
                  <Link href={href(locale, "periods", p.t.slug)}>{p.t.title}</Link>
                </h2>
                <p className="t-lead">{p.t.summary}</p>
                <div className={styles.chapterCols}>
                  {p.philosophers.length > 0 && (
                    <div>
                      <p className="t-eyebrow">{d.period.philosophers}</p>
                      <ul className={styles.links}>
                        {p.philosophers.map((r) => <li key={r.id}><Link href={href(locale, "philosophers", r.slug)}>{r.title}</Link> <span className="t-meta">{r.meta}</span></li>)}
                      </ul>
                    </div>
                  )}
                  {p.schools.length > 0 && (
                    <div>
                      <p className="t-eyebrow">{d.period.schools}</p>
                      <ul className={styles.links}>
                        {p.schools.map((r) => <li key={r.id}><Link href={href(locale, "schools", r.slug)}>{r.title}</Link></li>)}
                      </ul>
                    </div>
                  )}
                  {p.works.length > 0 && (
                    <div>
                      <p className="t-eyebrow">{d.period.works}</p>
                      <ul className={styles.links}>
                        {p.works.slice(0, 8).map((r) => <li key={r.id}><Link href={href(locale, "works", r.slug)}>{r.title}</Link> <span className="t-meta">{r.meta}</span></li>)}
                      </ul>
                    </div>
                  )}
                  {p.t.events && p.t.events.length > 0 && (
                    <div>
                      <p className="t-eyebrow">{d.period.events}</p>
                      <ul className={styles.events}>
                        {p.t.events.map((e) => <li key={e}>{e}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </TimelineScroll>
    );
  }

  return (
    <TimelineScroll className={styles.strip} variant="strip">
      <p className={`t-caption ${styles.scrollHint}`}>{d.period.scrollHint}</p>
      <div className={styles.rail} aria-hidden><span className={styles.railProgress} data-tl-progress /></div>
      <ol className={styles.stripList} aria-label={d.a11y.timeline}>
        {periods.map((p) => (
          <li key={p.id} className={styles.stripItem} data-tl-item data-current={p.id === currentId}>
            <Link href={href(locale, "periods", p.t.slug)} className={styles.stripLink}>
              <span className={styles.node} data-tl-node aria-hidden />
              <span className="t-meta">{formatSpan(p.startYear, p.endYear, locale, d.period.present)}</span>
              <span className={styles.stripTitle}>{p.t.title}</span>
              <span className={styles.stripCounts}>
                {p.philosophers.length} {d.home.philosophers} · {p.schools.length} {d.entity.schools.toLowerCase()}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </TimelineScroll>
  );
}
