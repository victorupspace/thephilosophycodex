import type { ReactNode } from "react";

/**
 * Static wrapper. Entrance animations were removed on purpose: the journal
 * direction has no decorative motion, and it keeps the motion runtime out of
 * the home bundle. Kept as a component so sections keep a stable API.
 */
export function Reveal({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "section" | "li" | "article"; delay?: number; stagger?: number }) {
  const Tag = as;
  return <Tag className={className}>{children}</Tag>;
}

export function RevealItem({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "li" | "article" }) {
  const Tag = as;
  return <Tag className={className}>{children}</Tag>;
}
