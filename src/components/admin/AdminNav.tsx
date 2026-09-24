"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./AdminNav.module.css";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/concepts", label: "Concepts" },
  { href: "/admin/philosophers", label: "Philosophers" },
  { href: "/admin/schools", label: "Schools" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/works", label: "Works" },
  { href: "/admin/periods", label: "Periods" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Backoffice">
      <ul className={styles.list}>
        {items.map((it) => {
          const active = it.href === "/admin" ? pathname === "/admin" : pathname.startsWith(it.href);
          return <li key={it.href}><Link href={it.href} className={styles.link} aria-current={active ? "page" : undefined}>{it.label}</Link></li>;
        })}
      </ul>
    </nav>
  );
}
