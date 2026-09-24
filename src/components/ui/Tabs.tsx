import Link from "next/link";
import styles from "./Tabs.module.css";

export interface TabLink { label: string; href: string; current?: boolean; count?: number }

/** Link-based tabs (URL is the state) — no client JS. */
export function TabNav({ tabs, ariaLabel }: { tabs: TabLink[]; ariaLabel: string }) {
  return (
    <nav aria-label={ariaLabel}>
      <ul className={styles.list}>
        {tabs.map((t) => (
          <li key={t.href}>
            <Link href={t.href} className={styles.tab} aria-current={t.current ? "true" : undefined}>
              {t.label}{t.count !== undefined && <span className="t-meta"> {t.count}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
