import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/auth";
import { supabaseEnv } from "@/lib/supabase/env";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function AdminLogin() {
  const session = await getAdminSession();
  if (session) redirect("/admin");
  const { configured } = supabaseEnv();
  return (
    <div style={{ maxWidth: "24rem", margin: "10vh auto", display: "grid", gap: "var(--s-6)" }}>
      <div>
        <p className="t-eyebrow">Backoffice</p>
        <h1 className="t-h2">Sign in</h1>
      </div>
      {configured ? (
        <LoginForm />
      ) : (
        <p className="t-small t-muted">Supabase is not configured. In development the backoffice opens without login (read-only seed mode); in production it is disabled until <code>NEXT_PUBLIC_SUPABASE_URL</code> and keys are set.</p>
      )}
    </div>
  );
}
