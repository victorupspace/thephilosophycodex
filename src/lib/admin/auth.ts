import { createServerSupabase } from "@/lib/supabase/server";
import { supabaseEnv } from "@/lib/supabase/env";

export type AdminSession = { email: string; role: "admin" | "editor"; mode: "supabase" } | { email: "dev@local"; role: "admin"; mode: "dev" };

/**
 * Resolves the backoffice session.
 * - Supabase configured: requires a signed-in user whose profile role is admin/editor.
 * - Not configured: allowed in development only (seed mode, read-only).
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const { configured } = supabaseEnv();
  if (!configured) {
    return process.env.NODE_ENV !== "production" ? { email: "dev@local", role: "admin", mode: "dev" } : null;
  }
  const client = await createServerSupabase();
  if (!client) return null;
  const { data: { user } } = await client.auth.getUser();
  if (!user) return null;
  const { data: profile } = await client.from("profiles").select("role").eq("id", user.id).maybeSingle();
  const role = profile?.role as string | undefined;
  if (role !== "admin" && role !== "editor") return null;
  return { email: user.email ?? "", role, mode: "supabase" };
}
