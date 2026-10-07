import { env, isConfigured, warnOnce } from "./env";

let started = false;

function addScript(opts: { src?: string; code?: string }) {
  const s = document.createElement("script");
  if (opts.src) {
    s.async = true;
    s.src = opts.src;
  }
  if (opts.code) s.textContent = opts.code;
  document.head.appendChild(s);
}

/** Loads GA4 + Clarity once. Missing/placeholder IDs are skipped with a single warning. */
export function initAnalytics() {
  if (started) return;
  started = true;

  const { ga4Id, clarityId } = env;

  if (isConfigured(ga4Id)) {
    addScript({ src: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}` });
    addScript({
      code: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', ${JSON.stringify(ga4Id)});`,
    });
  } else {
    warnOnce("ga4", "GA4 not connected: set VITE_GA4_ID in .env");
  }

  if (isConfigured(clarityId)) {
    addScript({
      code: `(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", ${JSON.stringify(clarityId)});`,
    });
  } else {
    warnOnce("clarity", "Clarity not connected: set VITE_CLARITY_ID in .env");
  }
}

/** Custom event helper; no-op until GA4 has loaded. */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window.gtag === "function") window.gtag("event", name, params);
}
