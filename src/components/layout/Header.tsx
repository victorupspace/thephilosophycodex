"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { href, type SectionKind } from "@/lib/i18n/routes";
import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
import { SearchTrigger } from "@/components/search/SearchTrigger";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";
import { Logo } from "./Logo";
import styles from "./Header.module.css";

export interface NavItem { kind: SectionKind; label: string }

interface HeaderProps {
  locale: Locale;
  items: NavItem[];
  labels: { search: string; language: string; menu: string; close: string; openMenu: string; home: string; mainNavigation: string; theme: string; darkMode: string; lightMode: string };
}

function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}

export function Header({ locale, items, labels }: HeaderProps) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > 8, () => false);
  // The menu is "open for a given pathname": navigating closes it without an effect.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const menuOpen = openFor === pathname;
  const setMenuOpen = (next: boolean | ((prev: boolean) => boolean)) =>
    setOpenFor((prev) => ((typeof next === "function" ? next(prev === pathname) : next) ? pathname : null));
  const menuId = useId();

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenFor(null); };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); };
  }, [menuOpen]);

  const isActive = (kind: SectionKind) => pathname.startsWith(href(locale, kind));

  return (
    <>
    <header className={styles.header} data-scrolled={scrolled} data-menu={menuOpen}>
      <div className={`container ${styles.inner}`}>
        <Link href={href(locale)} className={styles.logo} aria-label={labels.home}>
          <Logo />
        </Link>

        <nav className={styles.nav} aria-label={labels.mainNavigation}>
          <ul>
            {items.map((it) => (
              <li key={it.kind}>
                <Link href={href(locale, it.kind)} className={styles.link} aria-current={isActive(it.kind) ? "page" : undefined}>
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <span className={styles.desktopOnly}><SearchTrigger label={labels.search} /></span>
          <span className={styles.mobileOnly}><SearchTrigger label={labels.search} compact /></span>
          <span className={styles.desktopOnly}><LanguageSwitcher locale={locale} label={labels.language} /></span>
          <span className={styles.desktopOnly}><ThemeToggle darkLabel={labels.darkMode} lightLabel={labels.lightMode} /></span>
          <button
            type="button"
            className={`${styles.burger} ${styles.mobileOnly}`}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? labels.close : labels.openMenu}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
    <AnimatePresence>
        {menuOpen && (
          <motion.div
            id={menuId}
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: reduce ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -8 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label={labels.menu}>
              <ul className={styles.mobileList}>
                {items.map((it, i) => (
                  <li key={it.kind} style={{ "--i": i } as React.CSSProperties}>
                    <Link href={href(locale, it.kind)} aria-current={isActive(it.kind) ? "page" : undefined}>{it.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className={styles.mobileLang}>
              <p className="t-eyebrow">{labels.language}</p>
              <LanguageSwitcher locale={locale} label={labels.language} variant="list" />
            </div>
            <div className={styles.mobileLang}>
              <p className="t-eyebrow">{labels.theme}</p>
              <ThemeToggle darkLabel={labels.darkMode} lightLabel={labels.lightMode} variant="list" />
            </div>
          </motion.div>
        )}
    </AnimatePresence>
    </>
  );
}
