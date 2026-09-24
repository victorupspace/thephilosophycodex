import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import { getAdminSession } from "@/lib/admin/auth";
import { Logo } from "@/components/layout/Logo";
import { AdminNav } from "@/components/admin/AdminNav";
import "@/styles/globals.css";
import styles from "./admin.module.css";

const sans = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = { title: { default: "Backoffice · The Philosophy Codex", template: "%s · Backoffice" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  return (
    <html lang="en" className={`${sans.variable}`}>
      <body className={styles.body}>
        {session ? (
          <div className={styles.shell}>
            <aside className={styles.sidebar}>
              <Link href="/admin" className={styles.brand}><Logo /><span className={styles.badge}>Backoffice</span></Link>
              <AdminNav />
              <div className={styles.session}>
                <p className="t-meta">{session.email}</p>
                <p className="t-caption">{session.role} · {session.mode === "dev" ? "seed (read-only)" : "supabase"}</p>
                <Link href="/pt" className="t-small">← Site</Link>
              </div>
            </aside>
            <main className={styles.main}>{children}</main>
          </div>
        ) : (
          <main className={styles.main}>{children}</main>
        )}
      </body>
    </html>
  );
}
