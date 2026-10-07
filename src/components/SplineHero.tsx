import { lazy, Suspense, useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { env, isConfigured, warnOnce } from "../lib/env";
import { useIsDesktop } from "../hooks/useMediaQuery";

const Spline = lazy(() => import("@splinetool/react-spline"));

const FALLBACK =
  "radial-gradient(60% 70% at 72% 40%, rgba(31,111,139,0.28), rgba(11,31,58,0) 70%), radial-gradient(35% 40% at 80% 30%, rgba(201,165,90,0.10), rgba(11,31,58,0) 70%)";

/**
 * 3D globe on the right half of the hero. Loads only when: URL configured, desktop,
 * motion allowed and the hero is in view. Otherwise a soft CSS gradient is shown.
 */
export function SplineHero() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const desktop = useIsDesktop();
  const url = env.splineHeroUrl;
  const connected = isConfigured(url);

  if (!connected) warnOnce("spline", "Spline not connected: set VITE_SPLINE_HERO_URL in .env");
  const live = connected && desktop && !reduce && inView;

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 md:left-1/2">
      <div className="absolute inset-0" style={{ background: FALLBACK }} />
      {live && (
        <Suspense fallback={<div className="absolute inset-0 animate-pulse bg-navy/40" />}>
          <Spline scene={url} className="absolute inset-0 h-full w-full opacity-70 pointer-events-none" />
        </Suspense>
      )}
    </div>
  );
}
