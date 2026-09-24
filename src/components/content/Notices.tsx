import type { Dictionary, Locale } from "@/lib/i18n";
import { format, localeMeta } from "@/lib/i18n";
import styles from "./Notices.module.css";

export function FallbackNotice({ locale, resolved, d }: { locale: Locale; resolved: Locale; d: Dictionary }) {
  return (
    <p className={styles.notice} role="note" lang={localeMeta[locale].htmlLang}>
      {format(d.content.fallbackNotice, { language: localeMeta[locale].nativeLabel, fallback: localeMeta[resolved].nativeLabel })}
    </p>
  );
}

export function PendingNotice({ d }: { d: Dictionary }) {
  return <p className={`${styles.notice} ${styles.pending}`} role="note">{d.content.pending}</p>;
}
