import { z } from "zod";
import type { Concept, Philosopher, School, Work } from "@/lib/domain/types";

/**
 * Runtime schema for the JSON content files under ./content. The files are
 * authored outside the app (editorial pipeline) and validated once at module
 * load so a malformed entry fails the build instead of a page.
 */
const locale = z.enum(["pt", "en", "fr", "de"]);
const status = z.enum(["draft", "review", "published"]);
const ids = z.array(z.string().min(1));

const base = {
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().min(1),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
};

const conceptTranslation = z.object({
  ...base,
  definition: z.string().optional(),
  etymology: z.string().optional(),
  body: z.string().optional(),
  synonyms: z.array(z.string()).optional(),
  nearTerms: z.array(z.string()).optional(),
  aliases: z.array(z.string()).optional(),
});

const philosopherTranslation = z.object({
  ...base,
  biography: z.string().optional(),
  keyIdeas: z.array(z.string()).optional(),
  areas: z.array(z.string()).optional(),
  aliases: z.array(z.string()).optional(),
});

const schoolTranslation = z.object({ ...base, definition: z.string().optional(), body: z.string().optional(), aliases: z.array(z.string()).optional() });
const workTranslation = z.object({ ...base, body: z.string().optional() });

const translations = <T extends z.ZodTypeAny>(t: T) => z.partialRecord(locale, t);

export const conceptSchema = z.object({
  id: z.string().min(1),
  status,
  featured: z.boolean().optional(),
  categoryIds: ids,
  philosopherIds: ids,
  schoolIds: ids,
  periodIds: ids,
  workIds: ids,
  sourceIds: ids,
  relations: z.array(z.object({ conceptId: z.string().min(1), kind: z.enum(["related", "opposite", "broader", "narrower"]) })),
  translations: translations(conceptTranslation),
});

export const philosopherSchema = z.object({
  id: z.string().min(1),
  status,
  featured: z.boolean().optional(),
  birthYear: z.number().int().nullable(),
  deathYear: z.number().int().nullable(),
  birthYearApprox: z.boolean().optional(),
  periodId: z.string().min(1),
  schoolIds: ids,
  categoryIds: ids,
  influencedByIds: ids,
  sourceIds: ids,
  portrait: z.object({ src: z.string(), alt: z.string() }).nullable().optional(),
  translations: translations(philosopherTranslation),
});

export const schoolSchema = z.object({
  id: z.string().min(1),
  status,
  periodId: z.string().min(1),
  startYear: z.number().int().nullable(),
  endYear: z.number().int().nullable(),
  influencedByIds: ids,
  relatedSchoolIds: ids,
  translations: translations(schoolTranslation),
});

export const workSchema = z.object({
  id: z.string().min(1),
  status,
  authorId: z.string().min(1),
  year: z.number().int().nullable(),
  yearApprox: z.boolean().optional(),
  originalTitle: z.string().min(1),
  originalLanguage: z.string().min(1),
  conceptIds: ids,
  sourceIds: ids,
  translations: translations(workTranslation),
});

export type ConceptInput = Omit<Concept, keyof import("@/lib/domain/types").Timestamps>;
export type PhilosopherInput = Omit<Philosopher, keyof import("@/lib/domain/types").Timestamps>;
export type SchoolInput = Omit<School, keyof import("@/lib/domain/types").Timestamps>;
export type WorkInput = Omit<Work, keyof import("@/lib/domain/types").Timestamps>;

function parseAll<T>(schema: z.ZodType<T>, items: unknown, label: string): T[] {
  const result = z.array(schema).safeParse(items);
  if (!result.success) {
    const issue = result.error.issues[0];
    const where = issue ? `${label}[${issue.path.join(".")}]: ${issue.message}` : label;
    throw new Error(`Invalid seed content — ${where}`);
  }
  return result.data;
}

export const parseConcepts = (items: unknown) => parseAll(conceptSchema, items, "concepts") as ConceptInput[];
export const parsePhilosophers = (items: unknown) => parseAll(philosopherSchema, items, "philosophers") as PhilosopherInput[];
export const parseSchools = (items: unknown) => parseAll(schoolSchema, items, "schools") as SchoolInput[];
export const parseWorks = (items: unknown) => parseAll(workSchema, items, "works") as WorkInput[];
