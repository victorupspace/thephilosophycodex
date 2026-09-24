import type { ReactNode } from "react";
import styles from "./Section.module.css";

/** Content section with an anchored heading — used inside entity pages. */
export function ContentSection({ id, title, children, count, aside }: { id: string; title: ReactNode; children: ReactNode; count?: number; aside?: ReactNode }) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <div className={styles.head}>
        <h2 id={`${id}-title`} className={`t-h3 ${styles.title}`}>
          {title}
          {count !== undefined && <span className={`t-meta ${styles.count}`}>{count}</span>}
        </h2>
        {aside}
      </div>
      <div className={styles.body}>{children}</div>
    </section>
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return <p className={styles.empty}>{children}</p>;
}

/** Two-column article layout: main content + sticky side rail. */
export function ArticleLayout({ children, rail }: { children: ReactNode; rail?: ReactNode }) {
  return (
    <div className={`container ${styles.layout}`}>
      <div className={styles.main}>{children}</div>
      {rail && <aside className={styles.rail}>{rail}</aside>}
    </div>
  );
}

export function RailBlock({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div className={styles.railBlock}>
      <p className="t-eyebrow">{title}</p>
      {children}
    </div>
  );
}
