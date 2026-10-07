# FMB Landing — Add-ons: Booking, Chatbot, WhatsApp, Analytics (TEST SETUP)

Add 4 features to the existing FMB VIP Immigration landing page (React + TypeScript + Vite + Tailwind + Motion). This is a **test/demo integration** — use placeholder IDs everywhere marked `REPLACE_ME`, keep all keys in `.env`, and make every block easy to swap for real credentials later. Do not break any existing animations or layout.

---

## 0. ENV SETUP

Create `.env.local` (add to `.gitignore` if not already) and a `.env.example`:

```
VITE_CAL_LINK=REPLACE_ME/fmb-immigration/consultation
VITE_CHATBASE_ID=REPLACE_ME
VITE_WHATSAPP_NUMBER=35799252255
VITE_GA4_ID=REPLACE_ME
VITE_CLARITY_ID=REPLACE_ME
```

Read all of these via `import.meta.env.VITE_*`. If a value is still `REPLACE_ME`, render nothing for that widget (don't crash) and `console.warn` once, so the site still works before real keys are added.

---

## 1. BOOKING — Cal.com embed

**Install:**
```
npm install @calcom/embed-react
```

**Create `src/components/BookingModal.tsx`:**
- A modal (Motion `AnimatePresence`, backdrop blur, same gold/navy brand as the rest of the site) that opens from:
  - The Hero "Get free evaluation" button
  - The Contact section (a new "Book a consultation" button next to the form)
  - A persistent "Book a call" pill in the header (desktop) next to the WhatsApp icon
- Inside the modal, use `Cal` component from `@calcom/embed-react`:
  ```tsx
  import Cal, { getCalApi } from "@calcom/embed-react";
  import { useEffect } from "react";

  export function BookingModal({ onClose }: { onClose: () => void }) {
    useEffect(() => {
      (async function () {
        const cal = await getCalApi();
        cal("ui", {
          theme: "light",
          styles: { branding: { brandColor: "#C9A55A" } }, // gold accent
        });
      })();
    }, []);

    return (
      <Cal
        calLink={import.meta.env.VITE_CAL_LINK}
        style={{ width: "100%", height: "100%", overflow: "scroll" }}
        config={{ layout: "month_view" }}
      />
    );
  }
  ```
- Modal size: `max-w-3xl w-[92vw] h-[80vh] rounded-2xl bg-ivory`, close button top-right (X, rotates 90deg on hover)
- If `VITE_CAL_LINK` is still `REPLACE_ME`, show a placeholder inside the modal: "Booking calendar not connected yet — set VITE_CAL_LINK in .env" with a muted illustration, instead of trying to load Cal.com

**Note for later:** real setup = free Cal.com account → connect Google Calendar → create a "consultation" event type → copy the link into `.env`. No backend code needed; Cal.com handles calendar sync.

---

## 2. CHATBOT — Chatbase widget

**No npm package needed — it's a script embed.**

**Create `src/components/Chatbot.tsx`:**
```tsx
import { useEffect } from "react";

export function Chatbot() {
  const chatbaseId = import.meta.env.VITE_CHATBASE_ID;

  useEffect(() => {
    if (!chatbaseId || chatbaseId === "REPLACE_ME") {
      console.warn("Chatbase not connected: set VITE_CHATBASE_ID in .env");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = chatbaseId;
    script.setAttribute("domain", "www.chatbase.co");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [chatbaseId]);

  return null;
}
```
- Mount `<Chatbot />` once near the root of `App.tsx` (it injects its own floating widget button, positioned bottom-right by Chatbase itself)
- Make sure the WhatsApp floating button (below) is positioned so it doesn't overlap the Chatbase bubble: WhatsApp button `bottom-24 right-6`, Chatbase sits at its default `bottom-6 right-6`

**Note for later:** real setup = free Chatbase account → create an agent → feed it the FMB site URL or paste the service descriptions from `content.ts` → set its fallback instruction to "if you don't know the answer or the user wants a callback, ask for their name and phone number and say the team will call back within 48 hours" → copy the Agent ID into `.env`.

---

## 3. WHATSAPP FLOATING BUTTON

**Create `src/components/WhatsAppButton.tsx`:**
```tsx
import { motion } from "motion/react";

export function WhatsAppButton() {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || "35799252255";
  const message = encodeURIComponent(
    "Hello, I'm interested in Cyprus immigration services."
  );

  return (
    <motion.a
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] 
                 flex items-center justify-center shadow-lg"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.8, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
    >
      {/* use lucide-react MessageCircle icon or inline WhatsApp SVG, white, 28px */}
    </motion.a>
  );
}
```
- Add a subtle looping pulse ring behind it (`absolute inset-0 rounded-full bg-[#25D366]`, `scale: [1, 1.6], opacity: [0.5, 0]`, infinite, 2.5s) to draw attention without being annoying
- Mount once in `App.tsx`, alongside `<Chatbot />`
- Also keep the header icon-link version (already specced in the main landing prompt) pointing to the same number — both should use `VITE_WHATSAPP_NUMBER`

---

## 4. ANALYTICS — GA4 + Microsoft Clarity

**Create `src/lib/analytics.ts`:**
```ts
export function initAnalytics() {
  const ga4Id = import.meta.env.VITE_GA4_ID;
  const clarityId = import.meta.env.VITE_CLARITY_ID;

  if (ga4Id && ga4Id !== "REPLACE_ME") {
    const s1 = document.createElement("script");
    s1.async = true;
    s1.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
    document.head.appendChild(s1);

    const s2 = document.createElement("script");
    s2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${ga4Id}');
    `;
    document.head.appendChild(s2);
  } else {
    console.warn("GA4 not connected: set VITE_GA4_ID in .env");
  }

  if (clarityId && clarityId !== "REPLACE_ME") {
    const s3 = document.createElement("script");
    s3.innerHTML = `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${clarityId}");
    `;
    document.head.appendChild(s3);
  } else {
    console.warn("Clarity not connected: set VITE_CLARITY_ID in .env");
  }
}

// Simple event helper for custom tracking
export function trackEvent(name: string, params?: Record<string, unknown>) {
  // @ts-expect-error gtag is injected globally by the script above
  if (typeof window.gtag === "function") {
    // @ts-expect-error same as above
    window.gtag("event", name, params);
  }
}
```

**Call `initAnalytics()` once in `App.tsx`** (`useEffect(() => initAnalytics(), [])`, run only in production build if you want: `if (import.meta.env.PROD) initAnalytics()`).

**Wire up `trackEvent` at these exact points** (so we actually see something useful in GA4 once real IDs are set):
- `trackEvent("whatsapp_click")` — on WhatsApp button click
- `trackEvent("booking_opened")` — when BookingModal opens
- `trackEvent("booking_source", { source: "hero" | "header" | "contact" })` — pass which button opened it
- `trackEvent("contact_form_submit")` — on contact form success
- `trackEvent("evaluation_cta_click")` — on the big "GET FREE EVALUATION" circular button
- `trackEvent("chatbot_opened")` — Chatbase fires its own `window.addEventListener("chatbase-opened", ...)` if available; wrap it in a try/catch, it's not critical if unsupported

**Note for later:** real setup = free GA4 property (analytics.google.com) → copy Measurement ID (`G-XXXXXXX`). Free Microsoft Clarity project (clarity.microsoft.com) → copy Project ID. Both just go into `.env.local`, nothing else changes.

---

## SUMMARY OF WHAT GETS ADDED TO `App.tsx`

```tsx
import { useEffect, useState } from "react";
import { Chatbot } from "./components/Chatbot";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { BookingModal } from "./components/BookingModal";
import { initAnalytics } from "./lib/analytics";

function App() {
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <>
      {/* ...existing sections, pass setBookingOpen down to Hero/Header/Contact buttons... */}
      <Chatbot />
      <WhatsAppButton />
      {bookingOpen && <BookingModal onClose={() => setBookingOpen(false)} />}
    </>
  );
}
```

---

## COST RECAP (for the test phase, all free tiers)

| Feature | Service | Free tier limit |
|---|---|---|
| Booking | Cal.com | Unlimited, 1 user, free forever |
| Chatbot | Chatbase | ~20 messages/day on free plan |
| WhatsApp | wa.me link | No limit, no account needed |
| Analytics | GA4 + Clarity | Both fully free, no traffic cap |

Nothing here requires a paid plan to test. When ready to go live for real, just swap the `.env` values for real account IDs — no code changes needed.
