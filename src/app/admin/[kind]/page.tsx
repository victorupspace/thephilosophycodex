import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminRepository } from "@/lib/admin/repository";
import type { AdminEntityKind } from "@/lib/data/repository";
import { Badge, Button } from "@/components/ui";
import { requireAdminPage } from "../guard";
import styles from "./list.module.css";

const kinds: AdminEntityKind[] = ["concepts", "philosophers", "schools", "categories", "works", "periods"];

export default async function AdminList({ params, searchParams }: { params: Promise<{ kind: string }>; searchParams: Promise<{ status?: string; q?: string }> }) {
  await requireAdminPage();
  const { kind } = await params;
  if (!kinds.includes(kind as AdminEntityKind)) notFound();
  const { status, q } = await searchParams;
  const repo = getAdminRepository();
  let items = await repo.list(kind as AdminEntityKind);
  if (status) items = items.filter((i) => i.status === status);
  if (q) items = items.filter((i) => i.title.toLowerCase().includes(q.toLowerCase()) || i.id.includes(q.toLowerCase()));

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div>
          <p className="t-eyebrow">Content</p>
          <h1 className="t-h1" style={{ textTransform: "capitalize" }}>{kind}</h1>
        </div>
        <Button href={`/admin/${kind}/new`} variant="accent" size="sm">+ New</Button>
      </header>
      <form className={styles.filters} method="get">
        <input name="q" defaultValue={q ?? ""} placeholder="Filter by title or id" className={styles.input} aria-label="Filter" />
        <select name="status" defaultValue={status ?? ""} className={styles.input} aria-label="Status">
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="review">Review</option>
          <option value="published">Published</option>
        </select>
        <Button variant="secondary" size="sm" type="submit">Apply</Button>
      </form>
      <table className={styles.table}>
        <thead>
          <tr><th>Title</th><th>ID</th><th>Status</th><th>Locales</th><th>Updated</th></tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td><Link href={`/admin/${kind}/${i.id}`} className={styles.title}>{i.title}</Link></td>
              <td className="t-meta">{i.id}</td>
              <td><Badge variant={i.status === "published" ? "accent" : i.status === "review" ? "gold" : "default"}>{i.status}</Badge></td>
              <td className="t-meta">{i.locales.join(" · ")}</td>
              <td className="t-meta">{i.updatedAt.slice(0, 10)}</td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan={5} className="t-muted">Nothing here.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
