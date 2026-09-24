import type { Locale } from "@/lib/i18n/config";
import type { EntityKind } from "@/lib/i18n/routes";
import { normalize } from "@/lib/utils/text";
import type { SearchDocument, SearchProvider, SearchQuery, SearchResponse, SearchResult } from "./types";

interface IndexedDoc {
  doc: SearchDocument;
  title: string;
  titleWords: string[];
  titleBigrams: Set<string>;
  aliases: { raw: string; norm: string; bigrams: Set<string> }[];
  summary: string;
}

/** Question-word noise removed from queries like "o que é empirismo?" */
const STOP_PATTERNS: RegExp[] = [
  /^(o que (e|significa|foi|sao)|que es|quem (foi|e)|what (is|was|does .* mean)|who (was|is)|qu'?est[- ]ce que( la| le| l')?|qui (etait|est)|was (ist|war|bedeutet)|wer (war|ist))\s+/i,
  /^(a|o|os|as|um|uma|the|a|an|la|le|les|un|une|der|die|das|ein|eine)\s+/i,
  /[?!.]+$/,
];

export function cleanQuery(q: string): string {
  let n = normalize(q).replace(/\s+/g, " ");
  for (const p of STOP_PATTERNS) n = n.replace(p, "").trim();
  return n;
}

function bigrams(s: string): Set<string> {
  const out = new Set<string>();
  const padded = ` ${s} `;
  for (let i = 0; i < padded.length - 1; i++) out.add(padded.slice(i, i + 2));
  return out;
}

function dice(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const g of a) if (b.has(g)) inter++;
  return (2 * inter) / (a.size + b.size);
}

const KIND_ORDER: Record<EntityKind, number> = { concepts: 0, philosophers: 1, schools: 2, categories: 3, works: 4, periods: 5 };

/**
 * In-memory provider: exact > prefix > word-prefix > alias > fuzzy (bigram Dice) > summary.
 * Locale-aware: documents in the request locale rank first; other locales are still searchable
 * (so "Metaphysik" finds the Portuguese entry when browsing in pt).
 */
export class MemorySearchProvider implements SearchProvider {
  readonly name = "memory";
  private index: IndexedDoc[] = [];
  private byEntity = new Map<string, Map<Locale, IndexedDoc>>();

  constructor(docs: SearchDocument[]) {
    this.build(docs);
  }

  private build(docs: SearchDocument[]) {
    this.index = docs.map((doc) => {
      const title = normalize(doc.title);
      return {
        doc,
        title,
        titleWords: title.split(/[^a-z0-9]+/).filter(Boolean),
        titleBigrams: bigrams(title),
        aliases: doc.aliases.filter(Boolean).map((raw) => { const norm = normalize(raw); return { raw, norm, bigrams: bigrams(norm) }; }),
        summary: normalize(doc.summary),
      };
    });
    for (const d of this.index) {
      if (!this.byEntity.has(d.doc.entityId)) this.byEntity.set(d.doc.entityId, new Map());
      this.byEntity.get(d.doc.entityId)!.set(d.doc.locale, d);
    }
  }

  private score(d: IndexedDoc, q: string, qWords: string[], qBigrams: Set<string>, locale: Locale): { score: number; matchedOn: SearchResult["matchedOn"]; alias?: string } | null {
    let best = 0;
    let matchedOn: SearchResult["matchedOn"] = "fuzzy";
    let alias: string | undefined;

    if (d.title === q) { best = 100; matchedOn = "title"; }
    else if (d.title.startsWith(q)) { best = 80 + Math.min(10, q.length); matchedOn = "title"; }
    else if (d.titleWords.some((w) => w.startsWith(q))) { best = 65; matchedOn = "title"; }
    else if (qWords.length > 1 && qWords.every((w) => d.titleWords.some((tw) => tw.startsWith(w)))) { best = 70; matchedOn = "title"; }
    else if (d.title.includes(q)) { best = 55; matchedOn = "title"; }

    for (const a of d.aliases) {
      let s = 0;
      if (a.norm === q) s = 78;
      else if (a.norm.startsWith(q)) s = 60;
      else if (a.norm.split(/[^a-z0-9]+/).some((w) => w.startsWith(q))) s = 48;
      else if (q.length >= 4) { const f = dice(qBigrams, a.bigrams); if (f >= 0.6) s = 30 + f * 20; }
      if (s > best) { best = s; matchedOn = "alias"; alias = a.raw; }
    }

    if (best < 45 && q.length >= 4) {
      const f = dice(qBigrams, d.titleBigrams);
      if (f >= 0.58) { const s = 35 + f * 25; if (s > best) { best = s; matchedOn = "fuzzy"; alias = undefined; } }
    }

    if (best === 0 && q.length >= 5 && d.summary.includes(q)) { best = 20; matchedOn = "summary"; }
    if (best === 0) return null;

    let score = best * d.doc.weight;
    if (d.doc.locale === locale) score *= 1.25;
    return { score, matchedOn, alias };
  }

  async search(query: SearchQuery): Promise<SearchResponse> {
    const started = performance.now();
    const q = cleanQuery(query.q);
    const limit = query.limit ?? 20;
    if (q.length < 1) return { query: query.q, results: [], total: 0, tookMs: 0 };
    const qWords = q.split(" ").filter(Boolean);
    const qBigrams = bigrams(q);
    const kinds = query.kinds && query.kinds.length ? new Set(query.kinds) : null;

    // Best score per entity (collapse locales), preferring the requested locale's document for display.
    const bestByEntity = new Map<string, { d: IndexedDoc; score: number; matchedOn: SearchResult["matchedOn"]; alias?: string }>();
    for (const d of this.index) {
      if (kinds && !kinds.has(d.doc.kind)) continue;
      const s = this.score(d, q, qWords, qBigrams, query.locale);
      if (!s) continue;
      const prev = bestByEntity.get(d.doc.entityId);
      if (!prev || s.score > prev.score) bestByEntity.set(d.doc.entityId, { d, ...s });
    }

    const results: SearchResult[] = [];
    for (const [entityId, hit] of bestByEntity) {
      const display = this.byEntity.get(entityId)?.get(query.locale) ?? hit.d;
      const cross = display !== hit.d;
      results.push({
        id: display.doc.id, kind: display.doc.kind, locale: display.doc.locale, title: display.doc.title, slug: display.doc.slug,
        summary: display.doc.summary, meta: display.doc.meta, hue: display.doc.hue, score: hit.score,
        matchedOn: cross ? "alias" : hit.matchedOn,
        matchedAlias: cross ? hit.d.doc.title : hit.alias,
      });
    }
    results.sort((a, b) => b.score - a.score || KIND_ORDER[a.kind] - KIND_ORDER[b.kind] || a.title.localeCompare(b.title));
    return { query: query.q, results: results.slice(0, limit), total: results.length, tookMs: Math.round(performance.now() - started) };
  }

  async suggest(q: string, locale: Locale, limit = 8): Promise<SearchResult[]> {
    return (await this.search({ q, locale, limit })).results;
  }
}
