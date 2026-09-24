import type { Dictionary, Locale } from "@/lib/i18n";
import { HeroSearch } from "./HeroSearch";
import styles from "./Hero.module.css";

export function Hero({ locale, d }: { locale: Locale; d: Dictionary }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.inner}`}>
        <h1 id="hero-title" className={`t-display ${styles.title}`}>The Philosophy Codex</h1>
        <p className={styles.subtitle}>{d.home.heroTitle} {d.home.heroSubtitle}</p>
        <div className={styles.search}>
          <HeroSearch locale={locale} placeholder={d.search.placeholder} submitLabel={d.search.open} examples={d.search.examples} examplesLabel={d.search.examplesLabel} scopes={d.search.scopes} entity={d.entity} />
        </div>
      </div>
    </section>
  );
}
