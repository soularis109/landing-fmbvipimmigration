import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { EASE } from "../lib/motion";
import { useLang } from "../hooks/useLang";
import { useIsDesktop } from "../hooks/useMediaQuery";
import { GOLDEN_VISA_FACTS, type GoldenVisaFact } from "../data/content";
import { SplitText } from "./ui/SplitText";
import { Photo } from "./ui/Photo";
import { LottieIcon } from "./ui/LottieIcon";

const FACT_STARTS = [0.25, 0.5, 0.75];

// flight path in vw/vh percent (top-left to bottom-right); plane and dashed trail share it
const FLIGHT = "M 4 12 C 22 -2, 38 30, 54 40 S 84 66, 95 88";

/** Plane scrubbed along an SVG path by scroll progress. Positions come from the path itself. */
function PlaneFlight({ progress }: { progress: MotionValue<number> }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);
  useEffect(() => setLen(pathRef.current?.getTotalLength() ?? 0), []);

  const at = (v: number) => {
    const p = pathRef.current;
    if (!p || !len) return { x: 4, y: 12, a: 30 };
    const d = v * len;
    const a = p.getPointAtLength(d);
    const b = p.getPointAtLength(Math.min(len, d + 2));
    // scale viewBox units to screen aspect so the heading matches what is drawn
    const ang = (Math.atan2((b.y - a.y) * (innerHeight / 100), (b.x - a.x) * (innerWidth / 100)) * 180) / Math.PI;
    return { x: a.x, y: a.y, a: ang };
  };
  const x = useTransform(progress, (v) => `${at(v).x}vw`);
  const y = useTransform(progress, (v) => `${at(v).y}vh`);
  // the paper-plane glyph points up-right (-45deg), so add 45 to follow the path
  const rotate = useTransform(progress, (v) => at(v).a + 45);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" fill="none">
        <motion.path
          ref={pathRef}
          d={FLIGHT}
          stroke="#C9A55A"
          strokeOpacity="0.4"
          strokeWidth="1.5"
          strokeDasharray="1 5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: progress }}
        />
      </svg>
      <motion.div className="absolute left-0 top-0 h-16 w-16 -translate-x-1/2 -translate-y-1/2" style={{ x, y, rotate }}>
        <LottieIcon name="plane" mode="scrub" progress={progress} className="h-full w-full" />
      </motion.div>
    </div>
  );
}

function ScrollNumber({ fact, progress, lang }: { fact: GoldenVisaFact; progress: MotionValue<number>; lang: string }) {
  const text = useTransform(progress, [0.25, 0.45], [0, fact.value ?? 0], { clamp: true });
  const formatted = useTransform(text, (v) =>
    `${fact.prefix ?? ""}${Math.round(v).toLocaleString(lang === "ru" ? "ru-RU" : "en-US")}`,
  );
  return <motion.span>{formatted}</motion.span>;
}

function PinnedFact({
  fact,
  start,
  progress,
  lang,
}: {
  fact: GoldenVisaFact;
  start: number;
  progress: MotionValue<number>;
  lang: string;
}) {
  const opacity = useTransform(progress, [start, start + 0.08], [0, 1]);
  const y = useTransform(progress, [start, start + 0.08], [30, 0]);
  return (
    <motion.div style={{ opacity, y }} className="border-t border-ink/15 py-4 md:py-5">
      <div className="font-display text-5xl leading-none text-gold md:text-6xl tabular-nums">
        {fact.value !== null ? <ScrollNumber fact={fact} progress={progress} lang={lang} /> : fact.display}
      </div>
      <p className="mt-2 max-w-md font-body text-sm text-ink/70">{fact.label}</p>
    </motion.div>
  );
}

function Pinned() {
  const { t, lang } = useLang();
  const facts = GOLDEN_VISA_FACTS[lang];
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const clipPath = useTransform(p, [0, 0.4], ["circle(15% at 50% 50%)", "circle(75% at 50% 50%)"]);
  const imgB = useTransform(p, [0.6, 0.8], [0, 1]);
  const ctaOpacity = useTransform(p, [0.85, 0.95], [0, 1]);
  const [ctaOn, setCtaOn] = useState(false);
  useMotionValueEvent(p, "change", (v) => setCtaOn(v > 0.9));

  return (
    <section id="golden-visa" ref={ref} aria-labelledby="gv-title" className="relative h-[300vh] bg-sand">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <PlaneFlight progress={p} />
        <div className="relative z-10 mx-auto grid w-full max-w-[1440px] grid-cols-2 items-center gap-16 px-12">
          <div className="relative h-[72vh] overflow-hidden rounded-[2rem]">
            <motion.div className="absolute inset-0" style={{ clipPath }}>
              <Photo src="/images/greece-1.jpg" alt={t.goldenVisa.altA} width={533} height={915} className="absolute inset-0 h-full w-full object-cover" />
              <motion.div className="absolute inset-0" style={{ opacity: imgB }}>
                <Photo src="/images/greece-2.jpg" alt={t.goldenVisa.altB} width={531} height={915} className="h-full w-full object-cover" />
              </motion.div>
            </motion.div>
          </div>

          <div>
            <p className="eyebrow mb-5">{t.goldenVisa.eyebrow}</p>
            <h2 id="gv-title" className="h2-display mb-8">
              <SplitText text={t.goldenVisa.title} />
            </h2>
            <div>
              {facts.map((f, i) => (
                <PinnedFact key={f.display} fact={f} start={FACT_STARTS[i]} progress={p} lang={lang} />
              ))}
            </div>
            <motion.a
              href={t.goldenVisa.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={ctaOn ? 0 : -1}
              style={{ opacity: ctaOpacity, pointerEvents: ctaOn ? "auto" : "none" }}
              className="mt-6 inline-block font-body text-sm text-sea underline underline-offset-4"
            >
              {t.goldenVisa.cta}
            </motion.a>
          </div>
        </div>
        <motion.div
          aria-hidden
          className="absolute bottom-0 left-0 h-px w-full origin-left bg-gold"
          style={{ scaleX: p }}
        />
      </div>
    </section>
  );
}

function Stacked() {
  const { t, lang } = useLang();
  const facts = GOLDEN_VISA_FACTS[lang];
  const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-10% 0px" },
    transition: { duration: 0.9, ease: EASE, delay },
  });
  return (
    <section id="golden-visa" aria-labelledby="gv-title" className="bg-sand px-5 py-20 md:px-12">
      <div className="mx-auto max-w-[1440px]">
        <p className="eyebrow mb-6">{t.goldenVisa.eyebrow}</p>
        <h2 id="gv-title" className="h2-display mb-10">
          <SplitText text={t.goldenVisa.title} />
        </h2>
        <div className="mb-10 grid grid-cols-2 gap-3">
          <motion.div {...reveal()} className="overflow-hidden rounded-2xl">
            <Photo src="/images/greece-1.jpg" alt={t.goldenVisa.altA} width={533} height={915} className="h-full w-full object-cover" />
          </motion.div>
          <motion.div {...reveal(0.12)} className="overflow-hidden rounded-2xl">
            <Photo src="/images/greece-2.jpg" alt={t.goldenVisa.altB} width={531} height={915} className="h-full w-full object-cover" />
          </motion.div>
        </div>
        {facts.map((f, i) => (
          <motion.div key={f.display} {...reveal(i * 0.08)} className="border-t border-ink/15 py-6">
            <div className="font-display text-5xl text-gold">{f.display}</div>
            <p className="mt-2 font-body text-sm text-ink/70">{f.label}</p>
          </motion.div>
        ))}
        <a
          href={t.goldenVisa.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-11 items-center font-body text-sm text-sea underline underline-offset-4"
        >
          {t.goldenVisa.cta}
        </a>
      </div>
    </section>
  );
}

export function GoldenVisa() {
  const isDesktop = useIsDesktop();
  const reduce = useReducedMotion();
  return isDesktop && !reduce ? <Pinned /> : <Stacked />;
}
