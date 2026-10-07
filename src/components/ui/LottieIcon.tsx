import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { LottieRefCurrentProps } from "lottie-react";
import { asset } from "../../lib/asset";
import { motionValue, useInView, useMotionValueEvent, useReducedMotion, type MotionValue } from "motion/react";

// lottie-web is heavy: keep it (and every JSON) out of the main chunk
const Lottie = lazy(() => import("lottie-react"));

// stable placeholder so the scrub hook can be called unconditionally
const dummy = motionValue(0);

const cache = new Map<string, Promise<object>>();
function load(name: string) {
  let p = cache.get(name);
  if (!p) {
    p = fetch(asset(`animations/${name}.json`)).then((r) => {
      if (!r.ok) throw new Error(`Lottie ${name}: ${r.status}`);
      return r.json();
    });
    cache.set(name, p);
  }
  return p;
}

export type LottieMode =
  | "loop" // continuous, paused while off-screen
  | "once" // waits for `trigger` (or enters view), plays once, stays on last frame
  | "hover" // rests on last frame, plays once from 0 while `trigger` is true
  | "scrub" // frame follows `progress` (0..1)
  | "static"; // last frame only

interface Props {
  name: string;
  mode?: LottieMode;
  trigger?: boolean;
  progress?: MotionValue<number>;
  className?: string;
}

export function LottieIcon({ name, mode = "loop", trigger, progress, className = "" }: Props) {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const lot = useRef<LottieRefCurrentProps>(null);
  const played = useRef(false);
  const [data, setData] = useState<object | null>(null);
  const [ready, setReady] = useState(false);
  const inView = useInView(wrap, { margin: "100px" });

  useEffect(() => {
    let off = false;
    load(name)
      .then((d) => !off && setData(d))
      .catch(() => {
        /* missing animation is non-critical */
      });
    return () => {
      off = true;
    };
  }, [name]);

  const lastFrame = () => Math.max(0, (lot.current?.getDuration(true) ?? 1) - 1);
  const showEnd = () => lot.current?.goToAndStop(lastFrame(), true);

  // reduced motion & static: show the finished frame only
  const frozen = reduce || mode === "static";

  useEffect(() => {
    if (!ready || !lot.current) return;
    if (frozen) {
      showEnd();
      return;
    }
    switch (mode) {
      case "loop":
        if (inView) lot.current.play();
        else lot.current.pause();
        break;
      case "once": {
        const go = trigger ?? inView;
        if (go && !played.current) {
          played.current = true;
          lot.current.goToAndPlay(0, true);
        } else if (!go && !played.current) {
          lot.current.goToAndStop(0, true);
        }
        break;
      }
      case "hover":
        if (trigger) lot.current.goToAndPlay(0, true);
        else showEnd();
        break;
      case "scrub":
        lot.current.goToAndStop((progress?.get() ?? 0) * lastFrame(), true);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, frozen, mode, trigger, inView]);

  useMotionValueEvent(progress ?? dummy, "change", (v) => {
    if (mode === "scrub" && ready && !frozen) lot.current?.goToAndStop(v * lastFrame(), true);
  });

  return (
    <div
      ref={wrap}
      aria-hidden
      className={className}
      style={{ opacity: ready ? 1 : 0, transition: "opacity .4s" }}
    >
      {data && (
        <Suspense fallback={null}>
          <Lottie
            lottieRef={lot}
            animationData={data}
            loop={mode === "loop"}
            autoplay={mode === "loop" && !frozen}
            onDOMLoaded={() => setReady(true)}
            style={{ width: "100%", height: "100%" }}
          />
        </Suspense>
      )}
    </div>
  );
}
