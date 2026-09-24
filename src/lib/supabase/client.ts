"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseEnv } from "./env";

/** Browser client (anon key). Returns null when Supabase is not configured. */
export function createClient() {
  const { url, anonKey, configured } = supabaseEnv();
  if (!configured) return null;
  return createBrowserClient(url!, anonKey!);
}
