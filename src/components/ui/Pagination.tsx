import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Pagination.module.css";

export function Pagination({ page, total, hrefFor, ariaLabel }: { page: number; total: number; hrefFor: (p: number) => string; ariaLabel: string }) {
  if (total <= 1) return null;
  const pages = Array.from({ length: total }, (_, i) => i + 1).filter((p) => p === 1 || p === total || Math.abs(p - page) <= 1);
  return (
    <nav className={styles.nav} aria-label={ariaLabel}>
      <Link href={hrefFor(page - 1)} className={[styles.page, page <= 1 && styles.disabled].filter(Boolean).join(" ")} aria-disabled={page <= 1}><ChevronLeft size={16} /></Link>
      {pages.map((p, i) => (
        <span key={p} style={{ display: "contents" }}>
          {i > 0 && pages[i - 1] !== p - 1 && <span className="t-meta">…</span>}
          <Link href={hrefFor(p)} className={styles.page} aria-current={p === page ? "page" : undefined}>{p}</Link>
        </span>
      ))}
      <Link href={hrefFor(page + 1)} className={[styles.page, page >= total && styles.disabled].filter(Boolean).join(" ")} aria-disabled={page >= total}><ChevronRight size={16} /></Link>
    </nav>
  );
}
