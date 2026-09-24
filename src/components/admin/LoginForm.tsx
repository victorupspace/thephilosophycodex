"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Field, Input } from "@/components/ui";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(null);
    const client = createClient();
    if (!client) { setError("Supabase not configured"); setBusy(false); return; }
    const { error } = await client.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) { setError(error.message); return; }
    router.replace("/admin");
    router.refresh();
  };

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: "var(--s-4)" }}>
      <Field id="email" label="Email"><Input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
      <Field id="password" label="Password" error={error}><Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></Field>
      <Button type="submit" variant="accent" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
    </form>
  );
}
