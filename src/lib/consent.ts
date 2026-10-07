import { initAnalytics } from "./analytics";

const KEY = "fmb-analytics-consent";
export type Consent = "granted" | "denied" | null;

export function getConsent(): Consent {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(v: "granted" | "denied") {
  try {
    localStorage.setItem(KEY, v);
  } catch {
    /* storage unavailable — choice applies to this session only */
  }
  if (v === "granted") startAnalyticsIfAllowed();
}

/** Analytics run only in production builds and only after the visitor accepted. */
export function startAnalyticsIfAllowed() {
  if (import.meta.env.PROD && getConsent() === "granted") initAnalytics();
}
