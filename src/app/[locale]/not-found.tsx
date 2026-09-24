"use client";

import { useParams } from "next/navigation";
import { defaultLocale, getDictionary, isLocale } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import { Button } from "@/components/ui";

/**
 * Client component on purpose: not-found boundaries are rendered into every
 * page's payload, so this file must not touch request APIs (headers/cookies)
 * or every route under [locale] would become dynamic.
 */
export default function NotFound() {
  const params = useParams<{ locale?: string }>();
  const locale = isLocale(params?.locale) ? params.locale : defaultLocale;
  const d = getDictionary(locale);
  return (
    <section className="section container container--narrow" style={{ textAlign: "center", paddingBlock: "var(--s-32)" }}>
      <p className="t-eyebrow">404</p>
      <h1 className="t-h1" style={{ marginTop: "var(--s-4)" }}>{d.pages.notFound.title}</h1>
      <p className="t-lead" style={{ marginTop: "var(--s-4)" }}>{d.pages.notFound.lead}</p>
      <div style={{ marginTop: "var(--s-8)" }}>
        <Button href={href(locale)}>{d.pages.notFound.cta}</Button>
      </div>
    </section>
  );
}
