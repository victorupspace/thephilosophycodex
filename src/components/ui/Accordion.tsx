import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./Accordion.module.css";

/** Native <details>: accessible, no JS, works before hydration. */
export function AccordionItem({ title, children, open }: { title: ReactNode; children: ReactNode; open?: boolean }) {
  return (
    <details className={styles.item} open={open}>
      <summary className={styles.summary}>
        <span>{title}</span>
        <Plus size={18} className={styles.icon} aria-hidden />
      </summary>
      <div className={styles.body}>{children}</div>
    </details>
  );
}
