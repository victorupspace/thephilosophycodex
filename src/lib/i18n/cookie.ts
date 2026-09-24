import { LOCALE_COOKIE, type Locale } from "./config";

/** Persist the preferred locale for the proxy's negotiation (1 year, lax). */
export function setLocaleCookie(locale: Locale) {
  if (typeof document === "undefined") return;
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}
