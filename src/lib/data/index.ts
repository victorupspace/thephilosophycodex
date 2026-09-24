import type { ContentRepository } from "./repository";
import { SeedRepository } from "./seed-repository";
import { SupabaseRepository } from "./supabase-repository";

let repo: ContentRepository | null = null;

/**
 * Single entry point for content reads. The data source is chosen by env:
 *   DATA_SOURCE=seed      → bundled demo data (default)
 *   DATA_SOURCE=supabase  → Postgres via Supabase (requires NEXT_PUBLIC_SUPABASE_URL + key)
 */
export function getRepository(): ContentRepository {
  if (repo) return repo;
  const source = process.env.DATA_SOURCE ?? "seed";
  if (source === "supabase" && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    repo = new SupabaseRepository();
  } else {
    repo = new SeedRepository();
  }
  return repo;
}

export type { ContentRepository, AdminRepository, AdminEntityKind, AdminEntity, AdminListItem } from "./repository";
