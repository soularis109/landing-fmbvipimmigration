import { useEffect } from "react";
import Lenis from "lenis";

let instance: Lenis | null = null;

/** Init once in App. Pass `enabled=false` for reduced-motion users (native scroll). */
export function useLenisInit(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({ lerp: 0.1 });
    instance = lenis;
    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      instance = null;
    };
  }, [enabled]);
}

export function lenisStop() {
  instance?.stop();
}

export function lenisStart() {
  instance?.start();
}

/** Scroll to a section id (without #) or to the top. Falls back to native scroll. */
export function scrollToId(id: string | "top") {
  if (id === "top") {
    if (instance) instance.scrollTo(0);
    else window.scrollTo({ top: 0 });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  if (instance) instance.scrollTo(el, { offset: -80 });
  else el.scrollIntoView();
}
