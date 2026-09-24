"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { locales, localeMeta, type Locale } from "@/lib/i18n/config";
import type { AdminEntity, AdminEntityKind } from "@/lib/data/repository";
import { saveEntity, setStatus, removeEntity, type ActionState } from "@/lib/admin/actions";
import { Badge, Button, Field, Input, Select, Textarea } from "@/components/ui";
import styles from "./EntityEditor.module.css";

interface Option { id: string; label: string }
interface Props { kind: AdminEntityKind; entity: AdminEntity | null; writable: boolean; saved: boolean; periodOptions: Option[]; philosopherOptions: Option[] }

const fieldsByKind: Record<AdminEntityKind, { key: string; label: string; rows: number }[]> = {
  concepts: [
    { key: "definition", label: "Definition (short, objective)", rows: 4 },
    { key: "etymology", label: "Etymology", rows: 4 },
    { key: "body", label: "Editorial body (paragraphs separated by blank lines, *em* for italics)", rows: 12 },
  ],
  philosophers: [
    { key: "biography", label: "Biography", rows: 10 },
    { key: "keyIdeas", label: "Key ideas (one per line)", rows: 5 },
    { key: "areas", label: "Main areas (one per line)", rows: 3 },
  ],
  schools: [
    { key: "definition", label: "Definition", rows: 4 },
    { key: "body", label: "Editorial body", rows: 10 },
  ],
  categories: [
    { key: "introduction", label: "Introduction", rows: 4 },
    { key: "definition", label: "Definition", rows: 6 },
    { key: "questions", label: "Central questions (one per line)", rows: 4 },
  ],
  works: [{ key: "body", label: "Summary / editorial body", rows: 10 }],
  periods: [{ key: "events", label: "Intellectual events (one per line)", rows: 5 }],
};

function get(entity: AdminEntity | null, l: Locale, key: string): string {
  const t = entity?.translations[l] as Record<string, unknown> | undefined;
  const v = t?.[key];
  if (Array.isArray(v)) return v.join("\n");
  return typeof v === "string" ? v : "";
}

export function EntityEditor({ kind, entity, writable, saved, periodOptions, philosopherOptions }: Props) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveEntity, { ok: false });
  const [tab, setTab] = useState<Locale>("pt");
  const [msg, setMsg] = useState<string | null>(null);
  const e = entity as (AdminEntity & Record<string, unknown>) | null;
  const isNew = !entity;

  const quick = async (status: "draft" | "review" | "published") => {
    if (!entity) return;
    const r = await setStatus(kind, entity.id, status);
    setMsg(r.ok ? `Status set to ${status}` : r.message ?? "Error");
  };

  const relationSnapshot = Object.fromEntries(Object.entries(e ?? {}).filter(([k]) => /Ids$|^relations$/.test(k)));

  return (
    <form action={action} className={styles.form}>
      <input type="hidden" name="kind" value={kind} />
      <header className={styles.head}>
        <div>
          <p className="t-eyebrow"><Link href={`/admin/${kind}`}>{kind}</Link> / {isNew ? "new" : entity.id}</p>
          <h1 className="t-h2">{isNew ? `New ${kind.slice(0, -1)}` : get(entity, "pt", "title") || get(entity, "en", "title") || entity.id}</h1>
        </div>
        <div className={styles.actions}>
          {entity && <Badge variant={entity.status === "published" ? "accent" : entity.status === "review" ? "gold" : "default"}>{entity.status}</Badge>}
          {entity && writable && (
            <>
              <Button type="button" variant="ghost" size="sm" onClick={() => quick("review")}>→ Review</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => quick("published")}>Publish</Button>
            </>
          )}
          <Button type="submit" variant="accent" size="sm" disabled={pending || !writable}>{pending ? "Saving…" : "Save"}</Button>
        </div>
      </header>

      {!writable && <p className={styles.notice}>Read-only seed mode. Configure Supabase to enable saving.</p>}
      {saved && <p className={`${styles.notice} ${styles.ok}`}>Saved.</p>}
      {msg && <p className={styles.notice}>{msg}</p>}
      {state.message && !state.ok && <p className={`${styles.notice} ${styles.err}`} role="alert">{state.message}</p>}

      <section className={styles.panel}>
        <h2 className="t-h4">Base</h2>
        <div className={styles.grid}>
          <Field id="id" label="ID (slug-like, immutable)"><Input id="id" name="id" defaultValue={entity?.id ?? ""} readOnly={!isNew} pattern="[a-z0-9-]+" placeholder="con-example" /></Field>
          <Field id="status" label="Status">
            <Select id="status" name="status" defaultValue={entity?.status ?? "draft"}>
              <option value="draft">draft</option><option value="review">review</option><option value="published">published</option>
            </Select>
          </Field>
          {(kind === "concepts" || kind === "philosophers") && (
            <label className={styles.check}><input type="checkbox" name="featured" defaultChecked={!!e?.featured} /> Featured on home</label>
          )}
          {kind === "philosophers" && (
            <>
              <Field id="birthYear" label="Birth year (negative = BCE)"><Input id="birthYear" name="birthYear" type="number" defaultValue={(e?.birthYear as number | null) ?? ""} /></Field>
              <Field id="deathYear" label="Death year"><Input id="deathYear" name="deathYear" type="number" defaultValue={(e?.deathYear as number | null) ?? ""} /></Field>
              <label className={styles.check}><input type="checkbox" name="birthYearApprox" defaultChecked={!!e?.birthYearApprox} /> Birth year approximate</label>
              <Field id="periodId" label="Period"><Select id="periodId" name="periodId" defaultValue={(e?.periodId as string) ?? ""}>{periodOptions.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</Select></Field>
            </>
          )}
          {kind === "schools" && (
            <>
              <Field id="periodId" label="Period"><Select id="periodId" name="periodId" defaultValue={(e?.periodId as string) ?? ""}>{periodOptions.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</Select></Field>
              <Field id="startYear" label="Start year"><Input id="startYear" name="startYear" type="number" defaultValue={(e?.startYear as number | null) ?? ""} /></Field>
              <Field id="endYear" label="End year (empty = present)"><Input id="endYear" name="endYear" type="number" defaultValue={(e?.endYear as number | null) ?? ""} /></Field>
            </>
          )}
          {kind === "categories" && (
            <>
              <Field id="order" label="Sort order"><Input id="order" name="order" type="number" defaultValue={(e?.order as number) ?? 0} /></Field>
              <Field id="hue" label="Accent hue (0–360)"><Input id="hue" name="hue" type="number" min={0} max={360} defaultValue={(e?.hue as number) ?? 220} /></Field>
            </>
          )}
          {kind === "works" && (
            <>
              <Field id="authorId" label="Author"><Select id="authorId" name="authorId" defaultValue={(e?.authorId as string) ?? ""}>{philosopherOptions.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</Select></Field>
              <Field id="year" label="Year"><Input id="year" name="year" type="number" defaultValue={(e?.year as number | null) ?? ""} /></Field>
              <label className={styles.check}><input type="checkbox" name="yearApprox" defaultChecked={!!e?.yearApprox} /> Year approximate</label>
              <Field id="originalTitle" label="Original title"><Input id="originalTitle" name="originalTitle" defaultValue={(e?.originalTitle as string) ?? ""} /></Field>
              <Field id="originalLanguage" label="Original language (BCP 47)"><Input id="originalLanguage" name="originalLanguage" defaultValue={(e?.originalLanguage as string) ?? ""} placeholder="grc, la, de…" /></Field>
            </>
          )}
          {kind === "periods" && (
            <>
              <Field id="order" label="Sort order"><Input id="order" name="order" type="number" defaultValue={(e?.order as number) ?? 0} /></Field>
              <Field id="startYear" label="Start year"><Input id="startYear" name="startYear" type="number" defaultValue={(e?.startYear as number) ?? ""} /></Field>
              <Field id="endYear" label="End year (empty = present)"><Input id="endYear" name="endYear" type="number" defaultValue={(e?.endYear as number | null) ?? ""} /></Field>
            </>
          )}
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.tabs} role="tablist" aria-label="Translations">
          {locales.map((l) => (
            <button key={l} type="button" role="tab" aria-selected={tab === l} className={styles.tab} onClick={() => setTab(l)}>
              {localeMeta[l].nativeLabel}{entity?.translations[l] ? "" : " ·"}
            </button>
          ))}
        </div>
        {locales.map((l) => (
          <div key={l} role="tabpanel" hidden={tab !== l} className={styles.grid}>
            <Field id={`t.${l}.title`} label="Title" error={state.errors?.[`t.${l}.title`]}><Input id={`t.${l}.title`} name={`t.${l}.title`} defaultValue={get(entity, l, "title")} /></Field>
            <Field id={`t.${l}.slug`} label="Slug" hint="lowercase, ascii, hyphens" error={state.errors?.[`t.${l}.slug`]}><Input id={`t.${l}.slug`} name={`t.${l}.slug`} defaultValue={get(entity, l, "slug")} pattern="[a-z0-9-]*" /></Field>
            <div className={styles.span}><Field id={`t.${l}.summary`} label="Summary (≤ 600)"><Textarea id={`t.${l}.summary`} name={`t.${l}.summary`} defaultValue={get(entity, l, "summary")} maxLength={600} rows={3} /></Field></div>
            {fieldsByKind[kind].map((f) => (
              <div key={f.key} className={styles.span}>
                <Field id={`t.${l}.${f.key}`} label={f.label}><Textarea id={`t.${l}.${f.key}`} name={`t.${l}.${f.key}`} defaultValue={get(entity, l, f.key)} rows={f.rows} /></Field>
              </div>
            ))}
            <Field id={`t.${l}.seoTitle`} label="SEO title (≤ 70)"><Input id={`t.${l}.seoTitle`} name={`t.${l}.seoTitle`} defaultValue={get(entity, l, "seoTitle")} maxLength={70} /></Field>
            <Field id={`t.${l}.seoDescription`} label="SEO description (≤ 160)"><Input id={`t.${l}.seoDescription`} name={`t.${l}.seoDescription`} defaultValue={get(entity, l, "seoDescription")} maxLength={160} /></Field>
          </div>
        ))}
      </section>

      <section className={styles.panel}>
        <h2 className="t-h4">Relations</h2>
        <p className="t-small t-muted">Relations (categories, philosophers, schools, periods, works, sources, synonyms, related/opposite concepts) live in join tables. A dedicated relation editor is the next backoffice iteration; current values:</p>
        <pre className={styles.pre}>{JSON.stringify(relationSnapshot, null, 2)}</pre>
      </section>

      {entity && writable && (
        <section className={`${styles.panel} ${styles.danger}`}>
          <h2 className="t-h4">Danger zone</h2>
          <Button type="button" variant="secondary" size="sm" onClick={async () => { if (confirm(`Delete ${entity.id}? This cannot be undone.`)) { const r = await removeEntity(kind, entity.id); if (!r.ok) setMsg(r.message ?? "Error"); } }}>Delete</Button>
        </section>
      )}
    </form>
  );
}
