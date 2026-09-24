"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { locales, type Locale } from "@/lib/i18n/config";
import type { AdminEntity, AdminEntityKind } from "@/lib/data/repository";
import type { ContentStatus } from "@/lib/domain/types";
import { slugify } from "@/lib/utils/text";
import { getAdminSession } from "./auth";
import { getAdminRepository } from "./repository";

const kinds = ["concepts", "philosophers", "schools", "categories", "works", "periods"] as const;

const translationSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().min(1).max(200).regex(/^[a-z0-9-]+$/),
  summary: z.string().trim().max(600).default(""),
  definition: z.string().trim().optional(),
  etymology: z.string().trim().optional(),
  body: z.string().trim().optional(),
  biography: z.string().trim().optional(),
  introduction: z.string().trim().optional(),
  keyIdeas: z.array(z.string().trim().min(1)).optional(),
  areas: z.array(z.string().trim().min(1)).optional(),
  questions: z.array(z.string().trim().min(1)).optional(),
  events: z.array(z.string().trim().min(1)).optional(),
  seoTitle: z.string().trim().max(70).optional(),
  seoDescription: z.string().trim().max(160).optional(),
});

const baseSchema = z.object({
  kind: z.enum(kinds),
  id: z.string().trim().min(1).regex(/^[a-z0-9-]+$/),
  status: z.enum(["draft", "review", "published"]),
  featured: z.boolean().optional(),
  birthYear: z.number().int().nullable().optional(),
  deathYear: z.number().int().nullable().optional(),
  birthYearApprox: z.boolean().optional(),
  periodId: z.string().optional(),
  startYear: z.number().int().nullable().optional(),
  endYear: z.number().int().nullable().optional(),
  order: z.number().int().optional(),
  hue: z.number().int().min(0).max(360).optional(),
  authorId: z.string().optional(),
  year: z.number().int().nullable().optional(),
  yearApprox: z.boolean().optional(),
  originalTitle: z.string().optional(),
  originalLanguage: z.string().optional(),
});

export interface ActionState { ok: boolean; message?: string; errors?: Record<string, string> }

function lines(v: FormDataEntryValue | null): string[] | undefined {
  const s = typeof v === "string" ? v : "";
  const arr = s.split("\n").map((x) => x.trim()).filter(Boolean);
  return arr.length ? arr : undefined;
}
function num(v: FormDataEntryValue | null): number | null {
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function opt(v: FormDataEntryValue | null): string | undefined {
  const s = typeof v === "string" ? v.trim() : "";
  return s || undefined;
}

async function requireEditor() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function saveEntity(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireEditor();
  const repo = getAdminRepository();
  if (!repo.writable) return { ok: false, message: "Read-only: seed data cannot be edited. Configure Supabase (DATA_SOURCE=supabase) to enable writes." };

  const kind = String(formData.get("kind")) as AdminEntityKind;
  const parsedBase = baseSchema.safeParse({
    kind,
    id: String(formData.get("id") ?? "").trim() || slugify(String(formData.get("t.pt.title") ?? formData.get("t.en.title") ?? "")),
    status: String(formData.get("status") ?? "draft"),
    featured: formData.get("featured") === "on",
    birthYear: num(formData.get("birthYear")), deathYear: num(formData.get("deathYear")), birthYearApprox: formData.get("birthYearApprox") === "on",
    periodId: opt(formData.get("periodId")), startYear: num(formData.get("startYear")), endYear: num(formData.get("endYear")),
    order: num(formData.get("order")) ?? undefined, hue: num(formData.get("hue")) ?? undefined,
    authorId: opt(formData.get("authorId")), year: num(formData.get("year")), yearApprox: formData.get("yearApprox") === "on",
    originalTitle: opt(formData.get("originalTitle")), originalLanguage: opt(formData.get("originalLanguage")),
  });
  if (!parsedBase.success) {
    return { ok: false, message: "Invalid base fields", errors: Object.fromEntries(parsedBase.error.issues.map((i) => [i.path.join("."), i.message])) };
  }

  const translations: Partial<Record<Locale, z.infer<typeof translationSchema>>> = {};
  const errors: Record<string, string> = {};
  for (const l of locales) {
    const title = opt(formData.get(`t.${l}.title`));
    if (!title) continue;
    const parsed = translationSchema.safeParse({
      title,
      slug: opt(formData.get(`t.${l}.slug`)) ?? slugify(title),
      summary: String(formData.get(`t.${l}.summary`) ?? ""),
      definition: opt(formData.get(`t.${l}.definition`)), etymology: opt(formData.get(`t.${l}.etymology`)), body: opt(formData.get(`t.${l}.body`)),
      biography: opt(formData.get(`t.${l}.biography`)), introduction: opt(formData.get(`t.${l}.introduction`)),
      keyIdeas: lines(formData.get(`t.${l}.keyIdeas`)), areas: lines(formData.get(`t.${l}.areas`)), questions: lines(formData.get(`t.${l}.questions`)), events: lines(formData.get(`t.${l}.events`)),
      seoTitle: opt(formData.get(`t.${l}.seoTitle`)), seoDescription: opt(formData.get(`t.${l}.seoDescription`)),
    });
    if (!parsed.success) { for (const i of parsed.error.issues) errors[`t.${l}.${i.path.join(".")}`] = i.message; continue; }
    translations[l] = parsed.data;
  }
  if (Object.keys(errors).length) return { ok: false, message: "Fix translation errors", errors };
  if (!Object.keys(translations).length) return { ok: false, message: "At least one translation (title) is required" };

  const b = parsedBase.data;
  const now = new Date().toISOString();
  const existing = await repo.get(kind, b.id);
  const stamps = { createdAt: existing?.createdAt ?? now, updatedAt: now, publishedAt: b.status === "published" ? existing?.publishedAt ?? now : existing?.publishedAt ?? null };
  const common = { id: b.id, status: b.status as ContentStatus, ...stamps, translations };

  let entity: AdminEntity;
  switch (kind) {
    case "concepts": entity = { ...(existing ?? { categoryIds: [], philosopherIds: [], schoolIds: [], periodIds: [], workIds: [], sourceIds: [], relations: [] }), ...common, featured: b.featured } as AdminEntity; break;
    case "philosophers": entity = { ...(existing ?? { schoolIds: [], categoryIds: [], influencedByIds: [], sourceIds: [], portrait: null }), ...common, featured: b.featured, birthYear: b.birthYear ?? null, deathYear: b.deathYear ?? null, birthYearApprox: b.birthYearApprox, periodId: b.periodId ?? "" } as AdminEntity; break;
    case "schools": entity = { ...(existing ?? { influencedByIds: [], relatedSchoolIds: [] }), ...common, periodId: b.periodId ?? "", startYear: b.startYear ?? null, endYear: b.endYear ?? null } as AdminEntity; break;
    case "categories": entity = { ...(existing ?? {}), ...common, order: b.order ?? 0, hue: b.hue ?? 220 } as AdminEntity; break;
    case "works": entity = { ...(existing ?? { conceptIds: [], sourceIds: [] }), ...common, authorId: b.authorId ?? "", year: b.year ?? null, yearApprox: b.yearApprox, originalTitle: b.originalTitle ?? "", originalLanguage: b.originalLanguage ?? "" } as AdminEntity; break;
    case "periods": entity = { ...(existing ?? {}), ...common, order: b.order ?? 0, startYear: b.startYear ?? 0, endYear: b.endYear ?? null } as AdminEntity; break;
  }

  try {
    await repo.upsert(kind, entity);
  } catch (e) {
    return { ok: false, message: (e as Error).message };
  }
  revalidatePath("/", "layout");
  redirect(`/admin/${kind}/${b.id}?saved=1`);
}

export async function setStatus(kind: AdminEntityKind, id: string, status: ContentStatus): Promise<ActionState> {
  await requireEditor();
  const repo = getAdminRepository();
  if (!repo.writable) return { ok: false, message: "Read-only seed mode." };
  try { await repo.setStatus(kind, id, status); } catch (e) { return { ok: false, message: (e as Error).message }; }
  revalidatePath("/", "layout");
  revalidatePath(`/admin/${kind}`);
  return { ok: true };
}

export async function removeEntity(kind: AdminEntityKind, id: string): Promise<ActionState> {
  await requireEditor();
  const repo = getAdminRepository();
  if (!repo.writable) return { ok: false, message: "Read-only seed mode." };
  try { await repo.remove(kind, id); } catch (e) { return { ok: false, message: (e as Error).message }; }
  revalidatePath("/", "layout");
  redirect(`/admin/${kind}`);
}
