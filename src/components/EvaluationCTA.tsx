import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLang } from "../hooks/useLang";
import { trackEvent } from "../lib/analytics";
import { EVALUATION_PDF } from "../data/content";
import { SplitText } from "./ui/SplitText";
import { MagneticButton } from "./ui/MagneticButton";

export function EvaluationCTA() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["10%", "-25%"]);

  return (
    <section ref={ref} aria-labelledby="cta-title" className="px-5 py-10 md:px-8 md:py-16">
      <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[2rem] bg-gold px-6 py-16 text-navy md:px-14 md:py-24">
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -bottom-10 left-0 select-none whitespace-nowrap font-display text-[40vw] leading-none text-transparent md:text-[28vw]"
          style={{ x, WebkitTextStroke: "2px rgba(11,31,58,0.14)" }}
        >
          48h
        </motion.span>

        <div className="relative grid items-center gap-12 md:grid-cols-[1fr_auto]">
          <div>
            <h2 id="cta-title" className="font-display text-5xl leading-[0.95] md:text-8xl">
              <SplitText text={t.cta.title} />
            </h2>
            <p className="mt-8 max-w-xl font-body text-base text-navy/80 md:text-lg">{t.cta.sub}</p>
          </div>

          <div className="relative mx-auto flex h-64 w-64 items-center justify-center">
            <motion.svg
              aria-hidden
              viewBox="0 0 200 200"
              className="absolute inset-0 h-full w-full"
              animate={reduce ? undefined : { rotate: 360 }}
              transition={{ duration: 20, ease: "linear", repeat: Infinity }}
            >
              <defs>
                <path id="cta-circle" d="M100 100 m-85 0 a85 85 0 1 1 170 0 a85 85 0 1 1 -170 0" />
              </defs>
              <text fill="#0B1F3A" fontSize="11" letterSpacing="4" fontFamily="Manrope, sans-serif">
                <textPath href="#cta-circle">{t.cta.ringText.repeat(2)}</textPath>
              </text>
            </motion.svg>
            <MagneticButton
              href={EVALUATION_PDF}
              external
              onClick={() => trackEvent("evaluation_cta_click")}
              strength={0.4}
              className="h-40 w-40 rounded-full bg-navy p-6 text-center font-body text-xs font-semibold leading-snug tracking-[0.18em] text-sand"
            >
              {t.cta.button}
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
