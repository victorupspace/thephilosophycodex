import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./Tag.module.css";

interface TagProps {
  children: ReactNode;
  href?: string;
  meta?: string;
  className?: string;
  prefetch?: boolean;
}

export function Tag({ children, href, meta, className, prefetch }: TagProps) {
  const inner = (
    <>
      <span>{children}</span>
      {meta && <span className={styles.meta}>{meta}</span>}
    </>
  );
  const cn = [styles.tag, !href && styles.static, className].filter(Boolean).join(" ");
  if (href) return <Link href={href} className={cn} prefetch={prefetch}>{inner}</Link>;
  return <span className={cn}>{inner}</span>;
}

export function TagList({ children, className, ariaLabel }: { children: ReactNode; className?: string; ariaLabel?: string }) {
  return <ul className={[styles.list, className].filter(Boolean).join(" ")} aria-label={ariaLabel}>{children}</ul>;
}
