import type { ReactNode } from "react";

/**
 * Static wrapper around the server-rendered timeline. The earlier
 * scroll-driven GSAP enhancement was removed: the journal direction has no
 * decorative motion, and the markup already carries the full chronology.
 */
export function TimelineScroll({ children, className }: { children: ReactNode; className?: string; variant: "strip" | "full" }) {
  return <div className={className}>{children}</div>;
}
