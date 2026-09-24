"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n/config";
import { track } from "@/lib/analytics";

/** Fires a *_viewed analytics event once per mount. Zero UI. */
export function ViewTracker({ event, locale, id, slug }: { event: "concept_viewed" | "philosopher_viewed" | "category_viewed"; locale: Locale; id: string; slug: string }) {
  useEffect(() => { track(event, { locale, id, slug }); }, [event, locale, id, slug]);
  return null;
}
