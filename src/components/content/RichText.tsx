import { paragraphs } from "@/lib/utils/text";

/** Minimal, safe renderer for Markdown-lite bodies (paragraphs + *em*). No HTML pass-through. */
export function RichText({ body, serif = true, className }: { body: string; serif?: boolean; className?: string }) {
  const paras = paragraphs(body);
  return (
    <div className={["prose", serif && "prose--serif", className].filter(Boolean).join(" ")}>
      {paras.map((p, i) => (
        <p key={i}>{renderInline(p)}</p>
      ))}
    </div>
  );
}

function renderInline(text: string) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) =>
    part.startsWith("*") && part.endsWith("*") && part.length > 2 ? <em key={i}>{part.slice(1, -1)}</em> : <span key={i}>{part}</span>,
  );
}
