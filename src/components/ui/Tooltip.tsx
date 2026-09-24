import type { ReactNode } from "react";
import styles from "./Tooltip.module.css";

/** CSS-only tooltip. `label` is also exposed to assistive tech via aria-describedby-free pattern (visible text). */
export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className={styles.wrap}>
      {children}
      <span role="tooltip" className={styles.tip}>{label}</span>
    </span>
  );
}
