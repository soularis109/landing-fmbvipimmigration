# FMB Landing — "Wow Factor" Animation Pass (Lottie + Spline)

Upgrade the existing FMB VIP Immigration landing page (React + TypeScript + Vite + Tailwind + Motion) with ready-made themed animations so the site feels premium and sells itself in a client demo. Do not rebuild existing sections — layer these animations into the structure that already exists.

---

## 0. ASSET SOURCING (do this first, manually, before coding)

These are real, free, no-signup-required asset sources. Download the files into the project — do not hotlink external JSON in production.

### Lottie (lottiefiles.com — free tier, MIT/free license files only)
Browse these category pages and pick 1-2 files from each that match the navy/gold brand mood (prefer line-art / minimal / monochrome style animations, not cartoonish ones):

1. **Passport stamps** — https://lottiefiles.com/free-animations/passport
   → save as `public/animations/passport-stamp.json`
2. **Passport & ticket** — https://lottiefiles.com/free-animations/passport-and-ticket
   → save as `public/animations/passport-ticket.json`
3. **Travel pack** (plane, globe, map pin, suitcase) — https://lottiefiles.com/marketplace/travel-animation-pack_413175 (also try `_333222`, `_402087` for alternate styles)
   → save individual icons as `public/animations/plane.json`, `globe.json`, `map-pin.json`, `document-check.json`

If a specific free download isn't available without a paid plan, pick the next closest free result on the same page — do not force a premium-only file.

### Spline (spline.design — free account, Community Library)
1. Go to spline.design → Community → search **"globe"** or **"earth"**
2. Find a free, remixable scene (rotating earth / wireframe globe / dotted-sphere style fits the brand best)
3. Click "Remix" to clone it into your own free account, lightly recolor it to navy (`#0B1F3A`) base with gold (`#C9A55A`) accent dots/lines in the Spline editor
4. Export → Public URL (gives a `https://prod.spline.design/XXXXXXX/scene.splinecode` link)
5. Put that URL in `.env.local` as `VITE_SPLINE_HERO_URL`

If no suitable free scene is found or the export URL isn't ready, the component below must render a graceful CSS fallback (see 2.3) — never block the build on this.

---

## 1. INSTALL

```bash
npm install lottie-react @splinetool/react-spline @splinetool/runtime
```

---

## 2. COMPONENTS

### 2.1 `src/components/ui/LottieIcon.tsx`
Generic wrapper so any section can drop in a themed animation:
```tsx
import Lottie from "lottie-react";

interface Props {
  src: Record<string, unknown>; // imported JSON
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  playOnHover?: boolean;
}

export function LottieIcon({ src, className, loop = true, autoplay = true, playOnHover }: Props) {
  // if playOnHover: render with autoplay=false, loop=false,
  // use a ref + onMouseEnter to call lottieRef.current?.play(), onMouseLeave to pause and goToAndStop(0)
  return (
    <Lottie
      animationData={src}
      loop={loop}
      autoplay={autoplay && !playOnHover}
      className={className}
    />
  );
}
```
Tint note: most free Lottie files come in their own colors. Two options, pick based on what the downloaded files look like:
- If the file uses simple shapes, open the JSON and find `"c":{"k":[r,g,b,...]}` color keys and replace with the gold `0.788, 0.647, 0.353` / navy `0.043, 0.122, 0.227` values
- Otherwise just set `className="opacity-80 mix-blend-luminosity"` and let it sit on navy backgrounds as-is — don't over-engineer recoloring for a test build

### 2.2 Wire Lottie icons into EXISTING sections (no new sections, just enrich what's there):

- **Preloader:** replace the plain year counter with `passport-stamp.json` playing once (not looping) right as the counter hits 2026 — stamp "lands" with a little scale bounce, synced via `onComplete`
- **Hero floating chips:** each of the 3 chips gets a tiny 24px Lottie icon on the left (plane for "Answer in 48h", document-check for "100% success rate", globe for "EN · RU · GR")
- **Marquee (practice areas):** no icon needed, keep as is
- **About stats:** the "2013" stat card gets `passport-ticket.json` as a subtle 60px watermark icon top-right, low opacity (0.15), static
- **Services grid:** each `ServiceCard` gets a small (32px) category-matched Lottie icon top-right next to the number, `playOnHover` (plays once on card hover, resets on leave):
  - Citizenship cards → passport-stamp
  - Residency cards → document-check
  - Business cards → map-pin or a generic building icon from the pack
  - Lifestyle cards → plane / globe
- **Golden Visa pinned section:** `plane.json` flies along an SVG path (top-left to bottom-right) in sync with scroll progress — use `lottieRef.current?.goToAndStop(frame)` driven by the existing `useScroll` progress value instead of autoplay, so it's scroll-scrubbed like the rest of the section
- **Process timeline:** each of the 5 steps gets a small icon next to its number that plays once when the gold line reaches it (trigger via the existing in-view logic)
- **Regions section:** replace the current CSS-only rotating globe placeholder with `globe.json`, larger (120px), slow continuous loop

### 2.3 `src/components/SplineHero.tsx`
```tsx
import Spline from "@splinetool/react-spline";
import { Suspense } from "react";

export function SplineHero() {
  const url = import.meta.env.VITE_SPLINE_HERO_URL;

  if (!url || url === "REPLACE_ME") {
    // graceful fallback: soft navy/gold radial gradient + the existing animated SVG sine-wave lines
    return <div className="absolute inset-0 bg-gradient-radial from-sea/20 via-navy to-navy" />;
  }

  return (
    <Suspense fallback={<div className="absolute inset-0 bg-navy animate-pulse" />}>
      <Spline
        scene={url}
        className="absolute inset-0 w-full h-full opacity-70 pointer-events-none"
      />
    </Suspense>
  );
}
```
Mount this **behind** the existing Hero text and poster image, as an extra layer on the right third of the hero (`md:w-1/2 md:right-0`), not covering the headline. Keep `pointer-events-none` so it never blocks the CTA buttons. On mobile, don't render it at all (3D is heavy on phones) — show the CSS fallback gradient instead.

---

## 3. PERFORMANCE RULES (non-negotiable, or the "wow" becomes "slow")

- Lazy-load every Lottie JSON with dynamic `import()` — never bundle all animation JSONs into the main chunk
- Spline scene loads only after the Hero is in viewport AND only on `window.matchMedia("(min-width: 768px)").matches` AND only if `prefers-reduced-motion` is not set
- Total added JSON weight budget: keep each Lottie file under ~80kb; if a downloaded file is bigger, pick a simpler one from the same pack
- All looping Lottie animations pause via `IntersectionObserver` when scrolled out of view (don't animate off-screen elements)
- `prefers-reduced-motion`: disable Spline entirely, set all Lottie `autoplay={false}` and show first frame only

---

## 4. ENV ADDITIONS

```
VITE_SPLINE_HERO_URL=REPLACE_ME
```
(Lottie files are local JSON, no env var needed.)

---

## 5. WHAT TO TELL THE CLIENT ABOUT THESE ASSETS

These Lottie/Spline assets are free-tier placeholders chosen to prove the concept. For the final production version:
- Lottie: either keep free files (fine for permanent use, most are free-forever license) or commission 3-4 custom-branded icons on LottieFiles ($20-60 each) matching the gold/navy palette exactly
- Spline: free tier scenes carry a small Spline watermark in the corner on export unless upgraded to a paid plan (~$9-15/mo) — fine for a test/demo, should be swapped or upgraded before a real client launch
