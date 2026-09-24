import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import styles from "./Card.module.css";

/**
 * Card — a typographic cell of the ruled grid.
 *
 * The grid (`.grid > li`) draws the borders and stretches the cell; the card
 * owns rhythm and the link. Compose it from the slots below, in this order:
 *
 *   <Card>
 *     <CardHead meta="1724–1804" tag={<Badge>Modernidade</Badge>} />   optional
 *     <CardTitle href="…">Immanuel Kant</CardTitle>                     required
 *     <CardSummary>…</CardSummary>                                       optional
 *     <CardNote>…</CardNote>                                             optional
 *     <CardFooter aside={…}>Epistemologia, Ética</CardFooter>            optional, bottom-anchored
 *   </Card>
 */

type ClassPart = string | false | null | undefined | 0;
const cx = (...parts: ClassPart[]) => parts.filter(Boolean).join(" ");

interface CardProps {
  children: ReactNode;
  className?: string;
  /** `list` = results pages (no plate); `compact` = dense relation lists inside `.grid--soft`. */
  density?: "default" | "list" | "compact";
  as?: "div" | "article" | "li";
}

export function Card({ children, className, density = "default", as: Tag = "div" }: CardProps) {
  return <Tag className={cx(styles.card, density === "compact" && styles.compact, density === "list" && styles.list, className)}>{children}</Tag>;
}

/**
 * Top row. `meta` is a fact (a date, a lifespan, a span, counts, near terms)
 * on the left; `tag` is a classifying pill on the right. Default-density cards
 * always render it (even empty) so the plates align across a row.
 */
export function CardHead({ meta, tag }: { meta?: ReactNode; tag?: ReactNode }) {
  return (
    <div className={styles.head}>
      <span className={styles.meta}>{meta}</span>
      {tag ? <span className={styles.tag}>{tag}</span> : null}
    </div>
  );
}

export function CardTitle({ children, href, size = "default", className }: { children: ReactNode; href?: string; size?: "default" | "large"; className?: string }) {
  const cn = cx(styles.title, size === "large" && styles.titleLarge, className);
  return <h3 className={cn}>{href ? <Link href={href} className={styles.link}>{children}</Link> : children}</h3>;
}

/** Plain black body. Unclamped by default: summaries are 1–2 editorial sentences and should end on a full stop. */
export function CardSummary({ children, clamp }: { children: ReactNode; clamp?: number }) {
  return (
    <p className={cx(styles.summary, clamp && styles.clamp)} style={clamp ? ({ "--lines": clamp } as CSSProperties) : undefined}>
      {children}
    </p>
  );
}

/** Secondary line in muted 14px: an etymology, a "matched on" hint. */
export function CardNote({ children, clamp }: { children: ReactNode; clamp?: number }) {
  return (
    <p className={cx(styles.note, clamp && styles.clamp)} style={clamp ? ({ "--lines": clamp } as CSSProperties) : undefined}>
      {children}
    </p>
  );
}

/** Bottom-anchored fact in bold 14px, with an optional right-hand `aside` (e.g. a fallback-locale pill). */
export function CardFooter({ children, aside }: { children?: ReactNode; aside?: ReactNode }) {
  return (
    <div className={styles.footer}>
      <span className={styles.footerText}>{children}</span>
      {aside ? <span className={styles.aside}>{aside}</span> : null}
    </div>
  );
}
