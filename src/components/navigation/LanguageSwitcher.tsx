"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { localeMeta, locales, type Locale } from "@/lib/i18n/config";
import { setLocaleCookie } from "@/lib/i18n/cookie";
import { href, resolveSection } from "@/lib/i18n/routes";
import { track } from "@/lib/analytics";
import styles from "./LanguageSwitcher.module.css";

/**
 * Switches locale while preserving the current page. Reads hreflang <link>s
 * rendered by generateMetadata; falls back to the localized section index.
 */
export function LanguageSwitcher({ locale, label, variant = "menu" }: { locale: Locale; label: string; variant?: "menu" | "list" }) {
  const pathname = usePathname();
  const router = useRouter();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (!rootRef.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const targetFor = (to: Locale): string => {
    const link = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${localeMeta[to].htmlLang}"]`);
    if (link?.href) {
      try { const u = new URL(link.href); return u.pathname + u.search; } catch { /* ignore */ }
    }
    const segments = pathname.split("/").filter(Boolean);
    const section = segments[1] ? resolveSection(locale, segments[1]) : null;
    return section ? href(to, section) : href(to);
  };

  const change = (to: Locale) => {
    if (to === locale) { setOpen(false); return; }
    setLocaleCookie(to);
    track("language_changed", { from: locale, to });
    setOpen(false);
    router.push(targetFor(to));
  };

  if (variant === "list") {
    return (
      <ul className={styles.list} aria-label={label}>
        {locales.map((l) => (
          <li key={l}>
            <button type="button" onClick={() => change(l)} aria-current={l === locale ? "true" : undefined} lang={localeMeta[l].htmlLang}>
              {localeMeta[l].nativeLabel}
            </button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div ref={rootRef} className={styles.root}>
      <button
        type="button"
        className={styles.button}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${label}: ${localeMeta[locale].nativeLabel}`}
        onClick={() => setOpen((o) => !o)}
      >
        <Globe size={16} aria-hidden />
        <span className={styles.code}>{localeMeta[locale].short}</span>
        <ChevronDown size={14} aria-hidden className={styles.chev} data-open={open} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            id={menuId}
            role="menu"
            className={styles.menu}
            initial={{ opacity: 0, y: reduce ? 0 : -6, scale: reduce ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : -4, scale: reduce ? 1 : 0.98 }}
            transition={{ duration: reduce ? 0 : 0.16, ease: [0.22, 1, 0.36, 1] }}
          >
            {locales.map((l) => (
              <li key={l} role="none">
                <button type="button" role="menuitemradio" aria-checked={l === locale} lang={localeMeta[l].htmlLang} className={styles.item} onClick={() => change(l)}>
                  <span>{localeMeta[l].nativeLabel}</span>
                  {l === locale && <Check size={14} aria-hidden />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
