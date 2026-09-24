import type { Concept, Philosopher, School, Timestamps, Work } from "@/lib/domain/types";
import { categories } from "./categories";
import { periods } from "./periods";
import { schools as baseSchools } from "./schools";
import { philosophers as basePhilosophers } from "./philosophers";
import { concepts as baseConcepts } from "./concepts";
import { works as baseWorks } from "./works";
import { sources } from "./sources";
import { parseConcepts, parsePhilosophers, parseSchools, parseWorks } from "./schema";
import conceptsJson from "./content/concepts.json";
import philosophersJson from "./content/philosophers.json";
import schoolsJson from "./content/schools.json";
import worksJson from "./content/works.json";

/**
 * The seed has two layers:
 *  - the hand-written TypeScript modules (the original demo set), and
 *  - the editorial JSON files under ./content, produced by the research
 *    pipeline (see docs/CONTENT.md) and validated with zod at load time.
 * Both are merged here; ids must be unique across layers.
 */
const CONTENT_DATE = "2026-09-24T00:00:00.000Z";
const contentStamps: Timestamps = { createdAt: CONTENT_DATE, updatedAt: CONTENT_DATE, publishedAt: CONTENT_DATE };

function merge<T extends { id: string }>(base: T[], extra: Omit<T, keyof Timestamps>[], label: string): T[] {
  const seen = new Set(base.map((e) => e.id));
  const out = base.slice();
  for (const e of extra) {
    if (seen.has(e.id)) throw new Error(`Duplicate ${label} id in seed content: ${e.id}`);
    seen.add(e.id);
    out.push({ ...e, ...contentStamps } as unknown as T);
  }
  return out;
}

export { categories, periods, sources };
export const schools: School[] = merge(baseSchools, parseSchools(schoolsJson), "school");
export const philosophers: Philosopher[] = merge(basePhilosophers, parsePhilosophers(philosophersJson), "philosopher");
export const concepts: Concept[] = merge(baseConcepts, parseConcepts(conceptsJson), "concept");
export const works: Work[] = merge(baseWorks, parseWorks(worksJson), "work");
