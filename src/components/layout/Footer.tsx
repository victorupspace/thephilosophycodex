import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import type { CategoryView } from "@/lib/domain/types";
import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
import { Logo } from "./Logo";
import styles from "./Footer.module.css";

export function Footer({ locale, categories }: { locale: Locale; categories: CategoryView[] }) {
  const d = getDictionary(locale);
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Logo />
          <p className={`t-serif ${styles.statement}`}>{d.footer.statement}</p>
        </div>
        <nav className={styles.cols} aria-label={d.footer.explore}>
          <div>
            <p className="t-eyebrow" style={{ fontSize: "var(--fs-meta)" }}>{d.footer.explore}</p>
            <ul>
              <li><Link href={href(locale, "concepts")}>{d.nav.concepts}</Link></li>
              <li><Link href={href(locale, "philosophers")}>{d.nav.philosophers}</Link></li>
              <li><Link href={href(locale, "schools")}>{d.nav.schools}</Link></li>
              <li><Link href={href(locale, "works")}>{d.nav.works}</Link></li>
              <li><Link href={href(locale, "periods")}>{d.nav.timeline}</Link></li>
            </ul>
          </div>
          <div>
            <p className="t-eyebrow" style={{ fontSize: "var(--fs-meta)" }}>{d.footer.categories}</p>
            <ul>
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}><Link href={href(locale, "categories", c.t.slug)}>{c.t.title}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="t-eyebrow" style={{ fontSize: "var(--fs-meta)" }}>{d.footer.platform}</p>
            <ul>
              <li><Link href={href(locale, "about")}>{d.footer.about}</Link></li>
              <li><Link href={href(locale, "methodology")}>{d.footer.methodology}</Link></li>
              <li><Link href={href(locale, "sources")}>{d.footer.sources}</Link></li>
              <li><Link href={href(locale, "contact")}>{d.footer.contact}</Link></li>
            </ul>
          </div>
          <div>
            <p className="t-eyebrow" style={{ fontSize: "var(--fs-meta)" }}>{d.footer.language}</p>
            <LanguageSwitcher locale={locale} label={d.a11y.languageSwitcher} variant="list" />
          </div>
        </nav>
      </div>
      <div className={`container ${styles.bottom}`}>
        <p className="t-meta">© {year} The Philosophy Codex. {d.footer.rights}</p>
        <p className="t-meta">{d.site.tagline}</p>
      </div>
    </footer>
  );
}
