import Link from "next/link";
import { getAdminRepository } from "@/lib/admin/repository";
import { Badge } from "@/components/ui";
import { requireAdminPage } from "./guard";
import styles from "./dashboard.module.css";

export default async function AdminDashboard() {
  await requireAdminPage();
  const repo = getAdminRepository();
  const counts = await repo.counts();
  const kinds = Object.keys(counts) as (keyof typeof counts)[];
  return (
    <div className={styles.page}>
      <header>
        <p className="t-eyebrow">Content</p>
        <h1 className="t-h1">Dashboard</h1>
        {!repo.writable && <p className={styles.note}>Running on bundled seed data — read-only. Set <code>DATA_SOURCE=supabase</code> and Supabase keys to enable editing.</p>}
      </header>
      <ul className={styles.grid}>
        {kinds.map((k) => (
          <li key={k} className={styles.stat}>
            <Link href={`/admin/${k}`}>
              <p className="t-eyebrow">{k}</p>
              <p className={styles.total}>{counts[k].total}</p>
              <p className={styles.badges}>
                <Badge variant="accent">{counts[k].published} published</Badge>
                {counts[k].review > 0 && <Badge variant="gold">{counts[k].review} review</Badge>}
                {counts[k].draft > 0 && <Badge>{counts[k].draft} draft</Badge>}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
