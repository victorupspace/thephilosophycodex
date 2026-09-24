import type { Locale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";
import type { ContentStatus } from "@/lib/domain/types";
import type { AdminEntity, AdminEntityKind, AdminListItem, AdminRepository } from "@/lib/data/repository";
import { resolveTranslation } from "@/lib/data/resolve";
import * as seed from "@/data/seed";
import { SupabaseAdminRepository } from "./supabase-admin-repository";

const kindToSeed: Record<AdminEntityKind, AdminEntity[]> = {
  concepts: seed.concepts, philosophers: seed.philosophers, schools: seed.schools, categories: seed.categories, works: seed.works, periods: seed.periods,
};

function toListItem(kind: AdminEntityKind, e: AdminEntity): AdminListItem {
  const r = resolveTranslation(e.translations, "pt");
  return {
    id: e.id, kind, title: r?.t.title ?? e.id, slug: r?.t.slug ?? "", status: e.status,
    locales: locales.filter((l) => !!e.translations[l]) as Locale[], updatedAt: e.updatedAt,
  };
}

/** Read-only admin view over the bundled seed (used when Supabase is not configured). */
export class SeedAdminRepository implements AdminRepository {
  readonly writable = false;
  async list(kind: AdminEntityKind) { return kindToSeed[kind].map((e) => toListItem(kind, e)).sort((a, b) => a.title.localeCompare(b.title)); }
  async get(kind: AdminEntityKind, id: string) { return kindToSeed[kind].find((e) => e.id === id) ?? null; }
  async upsert(): Promise<AdminEntity> { throw new Error("Seed data is read-only. Configure Supabase to enable editing."); }
  async setStatus(): Promise<void> { throw new Error("Seed data is read-only. Configure Supabase to enable editing."); }
  async remove(): Promise<void> { throw new Error("Seed data is read-only. Configure Supabase to enable editing."); }
  async counts() {
    const out = {} as Record<AdminEntityKind, { total: number; published: number; draft: number; review: number }>;
    for (const kind of Object.keys(kindToSeed) as AdminEntityKind[]) {
      const items = kindToSeed[kind];
      out[kind] = {
        total: items.length,
        published: items.filter((i) => i.status === "published").length,
        draft: items.filter((i) => i.status === "draft").length,
        review: items.filter((i) => i.status === "review").length,
      };
    }
    return out;
  }
}

export function getAdminRepository(): AdminRepository {
  if (process.env.DATA_SOURCE === "supabase" && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return new SupabaseAdminRepository();
  }
  return new SeedAdminRepository();
}

export const statusOrder: ContentStatus[] = ["draft", "review", "published"];
