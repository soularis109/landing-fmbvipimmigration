import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { EASE } from "../lib/motion";
import { useLang } from "../hooks/useLang";
import { SplitText } from "./ui/SplitText";
import { LottieIcon } from "./ui/LottieIcon";

const STEP_ICONS = ["document-check", "map-pin", "passport-stamp", "building", "plane"];

export function Process() {
  const { t } = useLang();
  const { steps } = t.process;
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.65", "end 0.55"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // dot i is filled once the gold line has reached its position
    setActive(v < 0.02 ? 0 : steps.filter((_, i) => v >= (i / (steps.length - 1)) * 0.95).length);
  });

  return (
    <section id="process" aria-labelledby="process-title" className="bg-sand px-5 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <h2 id="process-title" className="h2-display">
          <SplitText text={t.process.title} />
        </h2>
        <p className="body-copy mt-6 max-w-xl text-ink/75">{t.process.sub}</p>

        <ol ref={ref} className="relative mt-16 max-w-3xl">
          <span aria-hidden className="absolute bottom-0 left-[11px] top-0 w-px bg-ink/15" />
          <motion.span
            aria-hidden
            className="absolute bottom-0 left-[11px] top-0 w-px origin-top bg-gold"
            style={{ scaleY: fill }}
          />
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              className="relative pb-14 pl-14 last:pb-0"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <motion.span
                aria-hidden
                className="absolute left-0 top-1.5 h-6 w-6 rounded-full border border-gold"
                animate={{ backgroundColor: i < active ? "#C9A55A" : "#F5F0E6" }}
                transition={{ duration: 0.4 }}
              />
              <div className="flex items-center gap-3">
                <span className="font-display text-xl text-gold">{String(i + 1).padStart(2, "0")}</span>
                <LottieIcon name={STEP_ICONS[i]} mode="once" trigger={i < active} className="h-7 w-7" />
              </div>
              <h3 className="font-display text-4xl leading-tight">{s.title}</h3>
              <p className="body-copy mt-2 text-ink/75">{s.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
