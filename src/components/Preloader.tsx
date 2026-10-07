import { useEffect, useState } from "react";
import { animate, motion } from "motion/react";
import { EASE } from "../lib/motion";
import { useLang } from "../hooks/useLang";
import { LottieIcon } from "./ui/LottieIcon";

/** Year ticker 2013 → 2026, then slides up. Parent wraps it in AnimatePresence. */
export function Preloader({ onCounted }: { onCounted: () => void }) {
  const { t } = useLang();
  const [year, setYear] = useState(2013);
  const [stamped, setStamped] = useState(false);

  useEffect(() => {
    const controls = animate(2013, 2026, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setYear(Math.round(v)),
      onComplete: () => {
        setStamped(true); // stamp lands as the counter reaches 2026
        setTimeout(onCounted, 950);
      },
    });
    return () => controls.stop();
  }, [onCounted]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-navy"
      initial={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 1, ease: EASE }}
      role="status"
      aria-label="Loading"
    >
      <div className="relative">
        <div className="font-display text-[15vw] leading-none text-gold tabular-nums">{year}</div>
        <LottieIcon
          name="passport-stamp"
          mode="once"
          trigger={stamped}
          className="absolute -right-[7vw] -top-[5vw] h-[16vw] w-[16vw] max-h-40 max-w-40"
        />
      </div>
      <p className="mt-6 font-body text-[0.65rem] md:text-xs tracking-[0.35em] text-sand/70">
        {t.preloader.label}
      </p>
    </motion.div>
  );
}
