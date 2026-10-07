/** A value counts as configured when it is non-empty and not a REPLACE_ME placeholder. */
export function isConfigured(v: string | undefined): v is string {
  return !!v && !v.includes("REPLACE_ME");
}

const warned = new Set<string>();
export function warnOnce(key: string, message: string) {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(message);
}

export const env = {
  calLink: import.meta.env.VITE_CAL_LINK,
  chatbaseId: import.meta.env.VITE_CHATBASE_ID,
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || "35799252255",
  ga4Id: import.meta.env.VITE_GA4_ID,
  clarityId: import.meta.env.VITE_CLARITY_ID,
  splineHeroUrl: import.meta.env.VITE_SPLINE_HERO_URL,
};
