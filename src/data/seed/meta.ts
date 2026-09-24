import type { Timestamps } from "@/lib/domain/types";

/**
 * SEED / DEMO DATA
 * ----------------
 * Everything under src/data/seed is demonstration content used while the
 * platform is not connected to Supabase. Facts (names, dates, affiliations)
 * are standard reference facts; long-form editorial bodies are intentionally
 * left empty so they can be authored through the backoffice.
 */
export const SEED_DATE = "2026-09-01T00:00:00.000Z";

export function stamps(publishedAt: string | null = SEED_DATE): Timestamps {
  return { createdAt: SEED_DATE, updatedAt: SEED_DATE, publishedAt };
}
