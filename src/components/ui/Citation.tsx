import type { Source } from "@/lib/domain/types";
import styles from "./Citation.module.css";

/** Bibliographic reference in a compact author–title–year style. */
export function Citation({ source }: { source: Source }) {
  const authors = source.authors.join("; ");
  return (
    <li className={styles.item}>
      <span>
        {authors && <span>{authors}. </span>}
        <span className={styles.title}>{source.title}</span>
        {source.year !== null && <span>, {source.year}</span>}
        {source.publisher && <span>. {source.publisher}</span>}.
        {source.url && (
          <>
            {" "}
            <a href={source.url} target="_blank" rel="noopener noreferrer">{new URL(source.url).hostname}</a>
          </>
        )}
        <span className={styles.type}>{source.type}</span>
      </span>
    </li>
  );
}

export function CitationList({ sources }: { sources: Source[] }) {
  return <ol className={styles.list}>{sources.map((s) => <Citation key={s.id} source={s} />)}</ol>;
}
