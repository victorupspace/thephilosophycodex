/** Strip diacritics and lowercase: "Metafísica" → "metafisica". */
export function normalize(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ß/g, "ss")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .toLowerCase()
    .trim();
}

export function slugify(input: string): string {
  return normalize(input)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, max = 160): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 40 ? lastSpace : max - 1).trimEnd()}…`;
}

export function initials(name: string): string {
  const parts = name.replace(/\(.*?\)/g, "").trim().split(/\s+/).filter((p) => p.length > 2 || /^[A-ZÀ-Ý]/.test(p));
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/** Split Markdown-lite body into paragraphs. */
export function paragraphs(body: string | undefined): string[] {
  if (!body) return [];
  return body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
}
