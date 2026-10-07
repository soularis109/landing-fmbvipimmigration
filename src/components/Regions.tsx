import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useLang } from "../hooks/useLang";
import { SplitText } from "./ui/SplitText";
import { LottieIcon } from "./ui/LottieIcon";

const DOTS = [
  { cx: 40, cy: 42 },
  { cx: 56, cy: 58 },
  { cx: 62, cy: 40 },
];

function Globe({ dot }: { dot: { cx: number; cy: number } }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto h-[120px] w-[120px]">
      <LottieIcon name="globe" className="h-full w-full" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <motion.circle
          cx={dot.cx}
          cy={dot.cy}
          r="2.5"
          fill="#C9A55A"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          animate={reduce ? undefined : { scale: [1, 2.6], opacity: [1, 0] }}
          transition={{ duration: 2, ease: "easeOut", repeat: Infinity }}
        />
        <circle cx={dot.cx} cy={dot.cy} r="2" fill="#C9A55A" />
      </svg>
    </div>
  );
}

export function Regions() {
  const { t } = useLang();
  const [hover, setHover] = useState<number | null>(null);
  return (
    <section aria-labelledby="regions-title" className="bg-navy px-5 py-20 text-sand md:px-12 md:py-24">
      <div className="mx-auto max-w-[1440px]">
        <h2 id="regions-title" className="h2-display max-w-3xl">
          <SplitText text={t.regions.title} />
        </h2>
        <ul className="mt-16 grid gap-12 md:grid-cols-3 md:gap-0 md:divide-x md:divide-sand/15">
          {t.regions.items.map((name, i) => (
            <motion.li
              key={name}
              className="px-4 text-center md:px-8"
              animate={{ opacity: hover === null || hover === i ? 1 : 0.4 }}
              transition={{ duration: 0.4 }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <Globe dot={DOTS[i]} />
              <h3 className="mt-8 font-display text-4xl md:text-5xl">{name}</h3>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
