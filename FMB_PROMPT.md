# FMB VIP Immigration — Animated Landing Page

Build a premium, branded, animated single-page landing for **F.M.B. VIP Immigration Services** (Limassol, Cyprus, est. 2013) using **React 19 + TypeScript + Vite 6 + Tailwind CSS v4 + Motion (`motion/react`) + Lenis** (smooth scroll). The page scrolls normally (unlike a fixed-viewport app) and every section has scroll-driven or in-view animation. Mood: Mediterranean luxury, calm confidence, "private bank" feel — not a generic WordPress agency site.

Work step by step: scaffold the project, build components one by one, run `npm run dev` and fix all TypeScript and console errors before finishing.

---

## TECH STACK & SETUP

- **Framework:** React 19 + TypeScript (strict)
- **Bundler:** Vite 6 with `@vitejs/plugin-react` and `@tailwindcss/vite`
- **Styling:** Tailwind CSS v4 via `@import "tailwindcss"`, theme tokens in `@theme`
- **Animation:** `motion` package (`import { motion, useScroll, useTransform, useInView, AnimatePresence } from "motion/react"`)
- **Smooth scroll:** `lenis` (init once in `App.tsx`, `lerp: 0.1`, destroy on unmount). Anchor links scroll via `lenis.scrollTo(target, { offset: -80 })`
- **Icons:** `lucide-react`
- **No backend.** Contact form is UI-only (see Contact section)

```json
"dependencies": {
  "@tailwindcss/vite": "^4.1.14",
  "@vitejs/plugin-react": "^5.0.4",
  "lenis": "^1.3.0",
  "lucide-react": "^0.460.0",
  "motion": "^12.23.24",
  "react": "^19.0.1",
  "react-dom": "^19.0.1",
  "vite": "^6.2.3"
}
```

### File structure
```
src/
  App.tsx
  index.css
  data/content.ts          // ALL text content lives here (EN + RU objects)
  hooks/useLenis.ts
  hooks/useLang.ts         // simple context: "en" | "ru"
  components/
    Preloader.tsx
    Header.tsx
    Hero.tsx
    Marquee.tsx
    About.tsx
    StatCounter.tsx
    Services.tsx
    ServiceCard.tsx
    GoldenVisa.tsx
    Process.tsx
    Regions.tsx
    EvaluationCTA.tsx
    Contact.tsx
    Footer.tsx
    ui/SplitText.tsx       // word-by-word reveal helper
    ui/MagneticButton.tsx
```

---

## BRAND & DESIGN SYSTEM

### Colors
```css
@theme {
  --color-navy: #0B1F3A;      /* primary dark, backgrounds of dark sections */
  --color-navy-2: #132C4F;    /* cards on dark */
  --color-sea: #1F6F8B;       /* secondary accent, links, focus rings */
  --color-sand: #F5F0E6;      /* main light background */
  --color-ivory: #FBF8F2;     /* cards on light */
  --color-gold: #C9A55A;      /* VIP accent: buttons, numbers, lines */
  --color-ink: #10141A;       /* body text on light */
  --font-display: "Cormorant Garamond", Georgia, serif;
  --font-body: "Manrope", "Inter", Arial, sans-serif;
}
```
- Gold is used sparingly: CTA buttons, numbers, thin divider lines, small labels
- Light sections: sand background, ink text. Dark sections: navy background, sand text
- Thin 1px dividers: `border-ink/15` on light, `border-sand/15` on dark

### Fonts (Google Fonts, in index.css)
- **Cormorant Garamond** 400, 500, 600 + italic 400 → all big headings, numbers
- **Manrope** 300–700 → body, nav, buttons, labels

### Typography scale
- Hero H1: `font-display text-[12vw] md:text-[8.5vw] leading-[0.9] tracking-[-0.02em]`
- Section H2: `font-display text-5xl md:text-7xl leading-[0.95]`
- Eyebrow labels: `font-body text-xs tracking-[0.25em] uppercase text-gold`
- Body: `font-body text-base md:text-lg leading-relaxed text-ink/75`

### Global easing
Use one custom ease everywhere: `const EASE = [0.16, 1, 0.3, 1]`. Default reveal: `duration: 0.9`.

---

## MEDIA ASSETS

Download the client's existing images into `public/images/` (do NOT hotlink in production):
```
https://fmbvipimmigration.com/wp-content/themes/storefront/img/slide-2/img-1.jpg      -> hero.jpg
https://fmbvipimmigration.com/wp-content/themes/storefront/img/bg-home-grece-1.jpg    -> greece-1.jpg
https://fmbvipimmigration.com/wp-content/themes/storefront/img/bg-home-grece-2.jpg    -> greece-2.jpg
https://fmbvipimmigration.com/wp-content/themes/storefront/img/slide-4/1.jpg          -> office-1.jpg
https://fmbvipimmigration.com/wp-content/themes/storefront/img/slide-4/2.jpg          -> office-2.jpg
https://fmbvipimmigration.com/wp-content/themes/storefront/img/slide-4/3.jpg          -> office-3.jpg
https://fmbvipimmigration.com/wp-content/themes/storefront/img/slide-4/4.jpg          -> office-4.jpg
```
If a download fails, use a navy→sea gradient placeholder div with the same aspect ratio so the layout never breaks. Apply a subtle warm grade to all photos: `filter: saturate(0.85) contrast(1.05)`.

---

## STRUCTURE (TOP TO BOTTOM)

### 0. PRELOADER
- Full-screen navy overlay, `z-[100]`
- Center: counter animating **2013 → 2026** (year ticker, 1.6s, ease-out), font-display 15vw, gold
- Below: small label "F.M.B. VIP IMMIGRATION SERVICES" letter-spaced
- Exit: overlay slides up `y: "-100%"`, 1s, EASE. Then Hero animations start (pass `ready` state via context or prop)
- Lock scroll (stop Lenis) while preloader is visible

### 1. FIXED HEADER
- Fixed top, `px-6 md:px-12 h-20`, `z-50`
- Transparent over hero; after 80px of scroll → `bg-sand/80 backdrop-blur-md` with border-bottom, text turns ink (animate with Motion)
- Hides on scroll down, shows on scroll up (`useScroll` + `useMotionValueEvent`, translateY 0 / -100%)
- **Left:** wordmark "F.M.B." (font-display 28px) + small "VIP IMMIGRATION" label under it
- **Center (md+):** links: Why Cyprus · Services · Golden Visa · Contact (anchor scroll). Hover: gold underline grows from left (`scaleX 0→1`, origin-left)
- **Right:** EN / RU switcher (toggles `useLang`), phone icon link `tel:+35799445099`, WhatsApp pill button → `https://wa.me/35799252255`
- **Mobile:** burger → full-screen navy menu, links stagger in (`y: 40 → 0`, stagger 0.08), big font-display 48px

### 2. HERO
- `min-h-[100svh]`, navy background, `hero.jpg` full-cover with `opacity-40` and a gradient overlay `bg-gradient-to-t from-navy via-navy/60 to-navy/20`
- **Parallax:** image `y` moves 0 → 20% and `scale` 1.1 → 1 as hero scrolls out (`useScroll({ target, offset: ["start start", "end start"] })`)
- **Animated sea lines:** 3 thin SVG sine-wave paths across the bottom third, stroke `gold/30`, 1px, slowly animating horizontally (infinite, 12s/18s/24s, linear). Subtle, not distracting
- **Content (bottom-left aligned, padding like header):**
  - Eyebrow: "LIMASSOL · CYPRUS · SINCE 2013"
  - H1 in 3 lines, each word revealed from below with mask (`overflow-hidden` wrapper, inner `y: "110%" → 0`, stagger 0.08):
    ```
    EU CITIZENSHIP
    & IMMIGRATION
    IN CYPRUS
    ```
    Make "& IMMIGRATION" italic
  - Sub text (max-w-xl, sand/80): "A full range of consulting, legal, financial, citizenship, real estate, taxation, accounting and banking services in Cyprus and across the world."
  - Buttons row: **"Get free evaluation"** (gold bg, navy text, MagneticButton) + **"Our services"** (outline sand/40) → scroll to services
- **Right bottom (md+):** vertical "Scroll" label + animated 1px line growing/shrinking (infinite)
- **Floating chips (md+):** 3 small glass chips (`bg-white/5 backdrop-blur border border-white/10 rounded-full px-4 py-2`) floating with gentle `y` bob animation (different delays): "100% success rate", "Answer in 48h", "EN · RU · GR"

### 3. MARQUEE — PRACTICE AREAS
- Sand background, border-y ink/15, py-8
- Infinite horizontal marquee (two duplicated tracks, `x: 0 → -50%`, 40s linear), pauses on hover
- Items in font-display italic 4xl, separated by a gold "✦":
  Citizenship by Naturalization ✦ Permanent Residence ✦ Pink Slip ✦ Yellow Slip ✦ Student Visa ✦ Corporate Services ✦ Employment Visa ✦ Banking ✦ Real Estate ✦ Legal Division
- **Scroll velocity:** speed up / reverse slightly based on scroll velocity (`useVelocity`), clamp it

### 4. ABOUT + STATS (id="about")
- Sand background, 2-column grid on md (7/5)
- **Left:** eyebrow "WHO WE ARE", H2 "Experienced immigration specialists", then paragraphs revealed line-by-line on scroll (opacity 0.15 → 1 per word, driven by `useScroll` progress — "reading highlight" effect):
  1. "F.M.B. VIP Immigration is a company specializing in all types of immigration and legal matters in Cyprus."
  2. "Working with clients from Russia and the CIS, the Middle East and Asia, we have earned a reputation for first-class service and the highest standards of honesty and professionalism."
  3. "We deal with most governmental meetings and paperwork, asking you to attend only when essential."
- **Right:** stack of 4 `StatCounter`s divided by lines. Numbers count up when in view (`useInView` once, 2s, ease-out), font-display 7xl gold:
  - **2013** — "Serving clients since"
  - **100%** — "Success rate for PR & citizenship applications"
  - **13+** — "Immigration & business services"
  - **48h** — "Free eligibility evaluation"
- Below: horizontal strip of the 4 office photos, each with clip-path reveal on scroll (`inset(100% 0 0 0)` → `inset(0)`, stagger 0.12), hover zoom 1.05

### 5. SERVICES (id="services")
- Navy background, sand text
- Header row: eyebrow "OUR SERVICES", H2 "Everything for your move — in one office"
- **Filter tabs:** All · Citizenship · Residency · Business · Lifestyle. Active tab has a gold pill background that slides between tabs (`layoutId="tab-pill"`)
- **Grid:** 1 col mobile / 2 md / 3 lg. Cards animate with `layout` + `AnimatePresence` when filter changes (fade + scale 0.95)
- **ServiceCard:** `bg-navy-2 border border-sand/10 rounded-2xl p-8 min-h-[280px]`, number "01"…"13" top-left in gold font-display, title font-display 3xl, short text sand/70, "+ Learn more" link bottom
  - Hover: gold radial spotlight follows the cursor inside the card (CSS var `--x --y` set onMouseMove, `radial-gradient(400px at var(--x) var(--y), rgba(201,165,90,0.15), transparent)`), border becomes gold/40, card lifts `y: -6`
- Cards (category → title → text → link):
  1. Citizenship — **Cyprus EU Citizenship** — "Several routes to Cypriot nationality: naturalization, marriage to a Cypriot, birth or Cypriot origins." → /cyprus-eu-citizenship
  2. Residency — **Permanent Residency** — "Non-EU citizens who buy property in Cyprus can use the accelerated procedure for a lifetime Permanent Residence Permit." → /permanent-residency
  3. Residency — **Temporary Residency (Pink Slip)** — "One-year temporary resident status allowing you to stay in Cyprus up to 365 days a year." → /temporary-residency
  4. Residency — **Registration Certificate (Yellow Slip)** — "The registration certificate for EU citizens, known for the yellow paper it's printed on." → /cyprus-registration-certificate-yellow-slip
  5. Residency — **Residency after Brexit** — "Procedure for UK nationals who did not register in Cyprus before 31 December 2020." → /cyprus-uk-citizenship
  6. Business — **Companies of Foreign Interest & Employment Visa** — "Work permits for EU and non-EU citizens — timely, professional, cost-effective." → /work-permit
  7. Business — **Corporate Services** — "Local and international company registration and administration." → /corporate-services
  8. Business — **Banking Services** — "Opening personal and corporate bank accounts in Cyprus on your behalf." → /banking-sector
  9. Business — **Legal Division** — "A team of professional lawyers with a client-centric approach." → /legal-division
  10. Lifestyle — **Property & Real Estate** — "Advisory on purchase, investment and sale of property all over Cyprus." → /property-management
  11. Lifestyle — **Student Visa** — "Student permits issued by the Civil Registry and Migration Department for a specific institution." → /student-visa
  12. Lifestyle — **Cyprus Driving Licence** — "Provisional or full driving licence — we handle the whole process." → /driving-licence
  13. Citizenship — **Citizenship by Investment** — "See Content Note below." → /cyprus-citizenship-by-investment
- All links are relative to `https://fmbvipimmigration.com` for now

### 6. GREECE GOLDEN VISA (id="golden-visa") — PINNED SCROLL SECTION
- Outer container `h-[300vh]`, inner `sticky top-0 h-screen overflow-hidden`, sand background
- Driven by `useScroll({ target, offset: ["start start", "end end"] })` → `progress` 0..1
- **Left half:** `greece-1.jpg` in a rounded frame whose `clipPath` grows from a small centered circle (`circle(15% at 50% 50%)`) to full rect (`circle(75%)`) over progress 0 → 0.4. Then crossfade to `greece-2.jpg` at 0.6 → 0.8
- **Right half:** eyebrow "GREECE · GOLDEN VISA", H2 "Residency in the EU for the whole family". Then 3 facts that appear one by one as progress passes 0.25 / 0.5 / 0.75 (fade + y 30 → 0), each with a big gold number:
  - **€250,000** — "Minimum property investment" (number counts up from 0 tied to scroll progress)
  - **3 months** — "To obtain Permanent Residency"
  - **5 years** — "Renewable permit, family incl. children up to 24 and parents of both spouses"
- Thin gold progress bar at the bottom of the sticky view (`scaleX: progress`)
- CTA at the end: "+ Learn more" → /greece-golden-visa
- Mobile: disable pinning, render as normal stacked section with in-view reveals

### 7. PROCESS — "WE MAKE IT EASY" (id="process")
- Sand background
- H2 "We make it easy" + subline "Step-by-step guidance that helps you avoid application errors and costly delays."
- Vertical timeline, 5 steps. A gold line on the left fills top→bottom with scroll (`scaleY` from `useScroll`). Each step's dot turns from outline to filled gold when the line reaches it
  1. **Free evaluation** — "Find out if you're eligible in less than 48 hours."
  2. **Strategy** — "We choose the right route: residency, citizenship, work or study."
  3. **Documents** — "We prepare and check every application to avoid errors."
  4. **Government** — "We attend meetings and handle paperwork; you come only when essential."
  5. **Life in Cyprus** — "Our legal team stays with you before, during and after your move."
- Steps reveal with `whileInView` x: -30 → 0

### 8. REGIONS — WHO WE SERVE
- Navy background, short section
- H2 "Trusted by clients from three regions"
- 3 large columns: **Russia & CIS**, **Middle East**, **Asia**. Each has a minimal SVG globe-style circle with dotted latitude lines rotating slowly (CSS animation), and a gold dot pulsing (`scale 1 → 2`, opacity 1 → 0, infinite)
- Hover on a column: other columns dim to opacity 0.4

### 9. FREE EVALUATION CTA
- Full-width gold background block, navy text, rounded-[2rem] with margin
- Huge font-display text: "Are you eligible to immigrate to Cyprus?"
- Subtext: "Before representing you, we offer a FREE immigration evaluation. Answer in less than 48 hours."
- Large circular button (w-40 h-40, navy, sand text "GET FREE EVALUATION"), circular text path rotating around it (SVG `textPath`, 20s infinite), MagneticButton behavior. Links to https://fmbvipimmigration.com/wp-content/uploads/2021/01/fmbvip.pdf
- Background: subtle big "48h" outline text drifting with scroll parallax

### 10. CONTACT (id="contact")
- Sand background, 2 columns md
- **Left:** eyebrow "CONTACT US", H2 "Let's start your case", details with icons:
  - Georgiou A, 85D, Germasogeia 4048, Limassol, Cyprus
  - +357 99 445099 · +357 99 252255 (tel: links)
  - info@fmbvipimmigration.com (mailto)
  - Instagram @fmbimmigration
  - Google Maps iframe below, rounded-2xl, `grayscale` filter that goes to color on hover:
    `https://www.google.com/maps?q=Georgiou+A+85,+Limassol+4048,+Cyprus&output=embed`
- **Right:** form card (ivory, rounded-2xl, p-8): Name, Email, Phone, Service (select from service titles), Message
  - Floating labels (label moves up on focus / filled), underline inputs, focus line animates gold
  - Basic validation (required name, valid email). Errors shake (`x: [0,-6,6,-4,4,0]`)
  - On submit: button morphs to a check icon, then show success message "Thank you. We'll contact you within 48 hours." No network request — leave a `// TODO: connect to backend / Formspree / CRM` comment
  - Below the form: big WhatsApp button "Prefer WhatsApp? Message us" → https://wa.me/35799252255

### 11. FOOTER
- Navy background
- Giant wordmark "F.M.B." spanning full width (font-display ~22vw), letters reveal with stagger when footer enters view
- Row: © 2026 F.M.B. VIP Immigration Services Ltd · social links (Instagram https://www.instagram.com/fmbimmigration/, Facebook https://www.facebook.com/fmbimmigrationservices/, LinkedIn https://www.linkedin.com/company/f-m-b-vip-immigration-services-ltd/) · "Back to top ↑" (lenis.scrollTo(0))

### Global extras
- **Custom cursor (desktop only, `pointer: fine`):** small gold dot + larger ring that follows with spring lag; ring grows over links/buttons. Hidden on touch devices
- **Scroll progress bar:** 2px gold bar fixed at the very top (`scaleX` from `useScroll().scrollYProgress`)
- **Grain overlay:** fixed, pointer-events-none, very subtle SVG noise at opacity 0.04 over everything

---

## LANGUAGE (EN / RU)

- All texts live in `src/data/content.ts` as `{ en: {...}, ru: {...} }`
- Write full Russian translations for all UI text and content
- `useLang()` context; switching language re-runs text reveals (key the sections by lang)

---

## ANIMATION SUMMARY

| Element | Trigger | Animation | Transition |
|---|---|---|---|
| Preloader | mount | 2013→2026 counter, slide up | 1.6s count, 1s exit EASE |
| Hero H1 words | preloader done | y 110% → 0 masked, stagger 0.08 | 0.9s EASE |
| Hero image | scroll | y 0→20%, scale 1.1→1 | scroll-linked |
| Header | scroll direction | hide/show, bg on scroll | 0.4s EASE |
| Marquee | always + velocity | x loop, velocity boost | 40s linear |
| About text | scroll | word opacity 0.15 → 1 | scroll-linked |
| Stats | in view | count up | 2s ease-out |
| Photos | in view | clip-path reveal | 1s EASE, stagger 0.12 |
| Service filter | tab click | layout + fade/scale | spring stiffness 300 damping 30 |
| Service card | hover | cursor spotlight, lift | 0.3s |
| Golden Visa | pinned scroll | clip circle → rect, facts in sequence | scroll-linked |
| Process line | scroll | scaleY fill, dots activate | scroll-linked |
| CTA circle text | always | rotate 360 | 20s linear infinite |
| Footer wordmark | in view | letters y 100% → 0 | 0.8s EASE, stagger 0.05 |

---

## RESPONSIVE

- **Mobile (<768px):** no custom cursor, no floating chips, Golden Visa not pinned, services 1 column, header burger menu, all buttons min-height 44px, section padding `px-5 py-20`
- **Tablet (768–1199px):** services 2 columns, about grid stacks if needed
- **Desktop (≥1200px):** full layout as described, container `max-w-[1440px] mx-auto`

## ACCESSIBILITY & PERFORMANCE

- Respect `prefers-reduced-motion`: disable Lenis, marquee, parallax and pinning; keep simple fades
- Semantic HTML (`header`, `main`, `section` with `aria-labelledby`, `footer`), visible focus rings (sea color)
- Images: `loading="lazy"` except hero, explicit width/height, `alt` text in current language
- Animate only `transform`, `opacity`, `clip-path`
- Set `<title>`: "F.M.B. VIP Immigration — EU Citizenship & Residency in Cyprus" and a meta description

---

## CONTENT NOTE (IMPORTANT)

Some legal/program information on the current website may be outdated (immigration programs and investment thresholds change). Keep the texts as provided, but mark the **Citizenship by Investment** card and the **Greece Golden Visa** numbers with a `// TODO: verify current program terms with client` comment, and put them in `content.ts` so they are easy to update.
