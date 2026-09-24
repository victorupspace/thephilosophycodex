"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import styles from "./ThemeToggle.module.css";

const KEY = "codex:theme";
type Theme = "light" | "dark";

const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}
function readTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}
function applyTheme(theme: Theme) {
  if (theme === "dark") document.documentElement.setAttribute("data-theme", "dark");
  else document.documentElement.removeAttribute("data-theme");
  try { localStorage.setItem(KEY, theme); } catch { /* storage unavailable: theme still applies for this page */ }
  listeners.forEach((cb) => cb());
}

/**
 * Light/dark switch. Light is the default; dark is opt-in and remembered
 * per browser. The root layout applies the saved value before first paint.
 */
export function ThemeToggle({ darkLabel, lightLabel, variant = "icon" }: { darkLabel: string; lightLabel: string; variant?: "icon" | "list" }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "light" as Theme);
  const isDark = theme === "dark";

  if (variant === "list") {
    return (
      <ul className={styles.list}>
        <li><button type="button" onClick={() => applyTheme("light")} aria-pressed={!isDark}>{lightLabel}</button></li>
        <li><button type="button" onClick={() => applyTheme("dark")} aria-pressed={isDark}>{darkLabel}</button></li>
      </ul>
    );
  }

  return (
    <button
      type="button"
      className={styles.button}
      onClick={() => applyTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? lightLabel : darkLabel}
      aria-pressed={isDark}
      title={isDark ? lightLabel : darkLabel}
    >
      {isDark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
    </button>
  );
}
