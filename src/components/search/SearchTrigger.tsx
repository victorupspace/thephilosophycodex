"use client";

import { Search } from "lucide-react";
import { useSearch } from "./SearchContext";
import styles from "./SearchTrigger.module.css";

/** Header button that opens the palette. Falls back to the search page when JS is off (it's a link inside a form-less button; header also renders a plain link for no-JS). */
export function SearchTrigger({ label, compact }: { label: string; compact?: boolean }) {
  const { openPalette } = useSearch();
  return (
    <button type="button" className={[styles.trigger, compact && styles.compact].filter(Boolean).join(" ")} onClick={() => openPalette()} aria-label={label} aria-keyshortcuts="Meta+K Control+K">
      <Search size={18} aria-hidden />
      {!compact && <span className={styles.text}>{label}</span>}
      {!compact && <kbd className={styles.kbd} aria-hidden>⌘K</kbd>}
    </button>
  );
}
