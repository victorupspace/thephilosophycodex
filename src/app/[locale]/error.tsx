"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { defaultLocale, getDictionary, isLocale } from "@/lib/i18n";
import { Button } from "@/components/ui";

export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const params = useParams<{ locale: string }>();
  const locale = isLocale(params?.locale) ? params.locale : defaultLocale;
  const d = getDictionary(locale);
  useEffect(() => { console.error(error); }, [error]);
  return (
    <section className="section container container--narrow" style={{ textAlign: "center", paddingBlock: "var(--s-32)" }}>
      <p className="t-eyebrow">500</p>
      <h1 className="t-h1" style={{ marginTop: "var(--s-4)" }}>{d.pages.error.title}</h1>
      <p className="t-lead" style={{ marginTop: "var(--s-4)" }}>{d.pages.error.lead}</p>
      <div style={{ marginTop: "var(--s-8)" }}>
        <Button onClick={reset}>{d.pages.error.retry}</Button>
      </div>
    </section>
  );
}
