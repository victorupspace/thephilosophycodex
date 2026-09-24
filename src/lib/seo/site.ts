export const SITE_NAME = "The Philosophy Codex";

/**
 * Public origin of the site. Uses NEXT_PUBLIC_SITE_URL when it is a valid URL
 * (a missing scheme is completed with https://), then the Vercel-provided
 * production/deployment host, then localhost. Empty or invalid values never
 * break the build.
 */
export function siteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];
  for (const value of candidates) {
    const raw = value?.trim();
    if (!raw) continue;
    const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    try {
      return new URL(withScheme).origin;
    } catch {
      continue;
    }
  }
  return "http://localhost:3000";
}

export function absoluteUrl(path: string): string {
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}
