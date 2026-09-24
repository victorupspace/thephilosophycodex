import type { AnalyticsEventName, AnalyticsEvents } from "./events";

export interface AnalyticsTransport {
  send<E extends AnalyticsEventName>(event: E, payload: AnalyticsEvents[E]): void;
}

const consoleTransport: AnalyticsTransport = {
  send(event, payload) {
    if (typeof window !== "undefined") console.debug(`[analytics] ${event}`, payload);
  },
};

const noopTransport: AnalyticsTransport = { send() {} };

let transport: AnalyticsTransport =
  process.env.NEXT_PUBLIC_ANALYTICS === "console" ? consoleTransport : noopTransport;

/** Swap the transport at runtime (e.g. Plausible, PostHog, custom endpoint). */
export function setAnalyticsTransport(t: AnalyticsTransport) {
  transport = t;
}

/** Fire-and-forget, never throws, safe on server and client. */
export function track<E extends AnalyticsEventName>(event: E, payload: AnalyticsEvents[E]): void {
  try {
    transport.send(event, payload);
  } catch {
    /* analytics must never break the UI */
  }
}
