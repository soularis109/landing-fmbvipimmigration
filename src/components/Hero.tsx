import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { EASE } from "../lib/motion";
import { useLang } from "../hooks/useLang";
import { scrollToId } from "../hooks/useLenis";
import { useBooking } from "../hooks/useBooking";
import { SplitText } from "./ui/SplitText";
import { MagneticButton } from "./ui/MagneticButton";
import { Photo } from "./ui/Photo";
import { LottieIcon } from "./ui/LottieIcon";
import { SplineHero } from "./SplineHero";

const CHIP_ICONS = ["document-check", "plane", "globe"];

function wavePath(amp: number, y: number) {
  // 4 full periods (600 units each) so a -50% shift loops seamlessly
  let d = `M0 ${y} Q150 ${y - amp} 300 ${y}`;
  for (let i = 0; i < 7; i++) d += ` T${(i + 2) * 300} ${y}`;
  return d;
}

const WAVES = [
  { amp: 38, y: 60, dur: 12, op: 0.3 },
  { amp: 26, y: 100, dur: 18, op: 0.22 },
  { amp: 48, y: 140, dur: 24, op: 0.16 },
];

export function Hero({ ready }: { ready: boolean }) {
  const { t } = useLang();
  const booking = useBooking();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "20%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 1.1, 1]);

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 24 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: reduce ? 0 : 24 },
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <section
      id="top"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-navy text-sand"
    >
      <SplineHero />
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <Photo
          src="/images/hero.jpg"
          alt={t.hero.alt}
          width={305}
          height={163}
          eager
          className="h-full w-full object-cover opacity-40"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/20" />

      {/* animated sea lines */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 overflow-hidden">
        {WAVES.map((w, i) => (
          <motion.div
            key={i}
            className="absolute left-0 w-[200%]"
            style={{ bottom: `${i * 14}%` }}
            animate={reduce ? undefined : { x: ["0%", "-50%"] }}
            transition={{ duration: w.dur, ease: "linear", repeat: Infinity }}
          >
            <svg viewBox="0 0 2400 200" className="h-24 w-full" preserveAspectRatio="none" fill="none">
              <path
                d={wavePath(w.amp, w.y)}
                stroke="#C9A55A"
                strokeOpacity={w.op}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-16 pt-32 md:px-12 md:pb-20">
        <motion.p className="eyebrow mb-6" {...fade(0)}>
          {t.hero.eyebrow}
        </motion.p>

        <h1
          id="hero-title"
          className="font-display text-[12vw] leading-[0.9] tracking-[-0.02em] md:text-[8.5vw]"
        >
          {t.hero.lines.map((line, i) => (
            <span key={i} className="block">
              <SplitText
                text={line}
                animate={ready}
                delay={i * 0.24}
                wordClassName={i === t.hero.italicLine ? "italic font-normal" : ""}
              />
            </span>
          ))}
        </h1>

        <motion.p className="mt-8 max-w-xl font-body text-base text-sand/80 md:text-lg" {...fade(0.7)}>
          {t.hero.sub}
        </motion.p>

        <motion.div className="mt-8 flex flex-wrap gap-4" {...fade(0.85)}>
          <MagneticButton
            onClick={() => booking.open("hero")}
            className="rounded-full bg-gold px-8 font-body text-sm font-semibold text-navy"
          >
            {t.hero.ctaPrimary}
          </MagneticButton>
          <MagneticButton
            onClick={() => scrollToId("services")}
            className="rounded-full border border-sand/40 px-8 font-body text-sm text-sand"
          >
            {t.hero.ctaSecondary}
          </MagneticButton>
        </motion.div>
      </div>

      {/* scroll cue */}
      <div
        aria-hidden
        className="absolute bottom-10 right-12 hidden flex-col items-center gap-3 md:flex"
      >
        <span className="font-body text-[0.65rem] tracking-[0.3em] uppercase [writing-mode:vertical-rl]">
          {t.hero.scroll}
        </span>
        <div className="h-16 w-px overflow-hidden">
          <motion.div
            className="h-full w-px origin-top bg-gold"
            animate={reduce ? undefined : { scaleY: [0, 1, 0], originY: [0, 0, 1] }}
            transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
          />
        </div>
      </div>

      {/* floating chips */}
      <div aria-hidden className="pointer-events-none absolute right-12 top-32 hidden flex-col items-end gap-4 md:flex">
        {t.hero.chips.map((c, i) => (
          <motion.span
            key={c}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-2 pl-3 pr-4 font-body text-xs tracking-wide backdrop-blur"
            animate={reduce ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 4 + i, ease: "easeInOut", repeat: Infinity, delay: i * 0.8 }}
          >
            <LottieIcon name={CHIP_ICONS[i]} className="h-6 w-6 shrink-0" />
            {c}
          </motion.span>
        ))}
      </div>
    </section>
  );
}
