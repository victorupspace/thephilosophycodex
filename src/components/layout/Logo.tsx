import styles from "./Logo.module.css";

/** Wordmark: a bracketed "C" glyph + Fraunces wordmark. Inline SVG, no request. */
export function Logo({ compact }: { compact?: boolean }) {
  return (
    <span className={styles.logo}>
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden focusable="false">
        <rect x="1.5" y="1.5" width="25" height="25" rx="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M18.5 10.2A6 6 0 1 0 18.5 17.8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="19.6" cy="14" r="1.4" fill="currentColor" />
      </svg>
      {!compact && <span className={styles.word}>The Philosophy Codex</span>}
    </span>
  );
}
