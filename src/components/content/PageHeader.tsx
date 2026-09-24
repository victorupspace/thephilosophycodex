import type { ReactNode } from "react";
import { Breadcrumb, type Crumb } from "@/components/ui";
import styles from "./PageHeader.module.css";

interface Props {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  crumbs?: Crumb[];
  crumbsLabel?: string;
  aside?: ReactNode;
  children?: ReactNode;
  hue?: number;
  size?: "index" | "entity";
}

export function PageHeader({ eyebrow, title, lead, crumbs, crumbsLabel = "Breadcrumb", aside, children, hue, size = "index" }: Props) {
  return (
    <header className={`${styles.header} ${size === "entity" ? styles.entity : ""}`} style={hue !== undefined ? ({ "--h": hue } as React.CSSProperties) : undefined}>
      <div className={`container ${styles.inner}`}>
        {crumbs && crumbs.length > 0 && <Breadcrumb items={crumbs} ariaLabel={crumbsLabel} />}
        <div className={styles.row}>
          <div className={styles.text}>
            {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
            <h1 className={size === "entity" ? "t-h1" : "t-h1"}>{title}</h1>
            {lead && <p className={`t-lead ${styles.lead}`}>{lead}</p>}
            {children}
          </div>
          {aside && <div className={styles.aside}>{aside}</div>}
        </div>
      </div>
    </header>
  );
}
