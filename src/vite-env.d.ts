/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CAL_LINK?: string;
  readonly VITE_CHATBASE_ID?: string;
  readonly VITE_WHATSAPP_NUMBER?: string;
  readonly VITE_GA4_ID?: string;
  readonly VITE_CLARITY_ID?: string;
  readonly VITE_SPLINE_HERO_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  clarity?: (...args: unknown[]) => void;
}
