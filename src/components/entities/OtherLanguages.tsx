import Link from "next/link";
import { type Locale, localeMeta, locales } from "@/lib/i18n/config";
import { href, type EntityKind } from "@/lib/i18n/routes";
import type { LocaleResolution } from "@/lib/domain/types";
import styles from "./OtherLanguages.module.css";

export function OtherLanguages({ entity, kind, current }: { entity: LocaleResolution; kind: EntityKind; current: Locale }) {
  return (
    <dl className={styles.list}>
      {locales.map((l) => {
        const title = entity.titles[l];
        const slug = entity.alternates[l];
        return (
          <div key={l} className={styles.row}>
            <dt className="t-meta">{localeMeta[l].nativeLabel}</dt>
            <dd lang={localeMeta[l].htmlLang}>
              {title && slug ? (l === current ? <strong>{title}</strong> : <Link href={href(l, kind, slug)} hrefLang={localeMeta[l].htmlLang}>{title}</Link>) : <span className="t-muted">—</span>}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
