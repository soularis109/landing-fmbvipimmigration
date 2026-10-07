import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";
import { LottieIcon } from "./ui/LottieIcon";

interface Props {
  value: number;
  suffix: string;
  label: string;
  watermark?: string;
}

export function StatCounter({ value, suffix, label, watermark }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, { duration: 2, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, value]);

  return (
    <div ref={ref} className="relative border-t border-ink/15 py-8 first:border-t-0 first:pt-0">
      {watermark && (
        <LottieIcon name={watermark} mode="static" className="absolute right-0 top-0 h-[60px] w-[60px] opacity-15" />
      )}
      <div className="font-display text-7xl leading-none text-gold tabular-nums" aria-label={`${value}${suffix}`}>
        <span aria-hidden>
          {n}
          {suffix}
        </span>
      </div>
      <p className="mt-3 font-body text-sm tracking-wide text-ink/70">{label}</p>
    </div>
  );
}
