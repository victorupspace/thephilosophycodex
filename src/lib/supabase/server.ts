import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { supabaseEnv } from "./env";

/** Request-scoped server client that reads/writes auth cookies. Null when not configured. */
export async function createServerSupabase() {
  const { url, anonKey, configured } = supabaseEnv();
  if (!configured) return null;
  const cookieStore = await cookies();
  return createServerClient(url!, anonKey!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) cookieStore.set(name, value, options);
        } catch {
          /* called from a Server Component: cookies are read-only there */
        }
      },
    },
  });
}

/** Service-role client for build-time reads and trusted server tasks. Never expose to the browser. */
export function createServiceClient() {
  const { url, serviceKey, anonKey } = supabaseEnv();
  const key = serviceKey ?? anonKey;
  if (!url || !key) return null;
  return createSupabaseClient(url, key, { auth: { persistSession: false } });
}
