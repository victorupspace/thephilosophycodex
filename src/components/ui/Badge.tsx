import type { ReactNode } from "react";
import styles from "./Badge.module.css";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "outline" | "accent" | "tint" | "gold";
  dot?: boolean;
  hue?: number;
  className?: string;
}

export function Badge({ children, variant = "default", dot, hue, className }: BadgeProps) {
  return (
    <span
      className={[styles.badge, variant !== "default" && styles[variant], dot && styles.dot, className].filter(Boolean).join(" ")}
      style={hue !== undefined ? ({ "--h": hue } as React.CSSProperties) : undefined}
    >
      {children}
    </span>
  );
}
