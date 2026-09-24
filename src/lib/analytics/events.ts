import type { Locale } from "@/lib/i18n/config";
import type { EntityKind } from "@/lib/i18n/routes";

/** Typed analytics event map. Add events here; transports stay generic. */
export type AnalyticsEvents = {
  search_started: { locale: Locale; source: "hero" | "palette" | "header" | "page" };
  search_completed: { locale: Locale; query: string; results: number; tookMs: number };
  concept_viewed: { locale: Locale; id: string; slug: string };
  philosopher_viewed: { locale: Locale; id: string; slug: string };
  category_viewed: { locale: Locale; id: string; slug: string };
  language_changed: { from: Locale; to: Locale };
  related_content_clicked: { locale: Locale; fromKind: EntityKind; fromId: string; toKind: EntityKind; toId: string };
};

export type AnalyticsEventName = keyof AnalyticsEvents;
