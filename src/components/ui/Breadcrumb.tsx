import Link from "next/link";
import { ChevronRight } from "lucide-react";
import styles from "./Breadcrumb.module.css";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items, ariaLabel }: { items: Crumb[]; ariaLabel: string }) {
  return (
    <nav aria-label={ariaLabel} className={styles.nav}>
      <ol className={styles.list}>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className={styles.item}>
              {item.href && !last ? <Link href={item.href}>{item.label}</Link> : <span className={styles.current} aria-current={last ? "page" : undefined}>{item.label}</span>}
              {!last && <ChevronRight size={14} className={styles.sep} aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
