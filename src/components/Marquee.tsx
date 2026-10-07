import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useLang } from "../hooks/useLang";

const BASE_SPEED = 50 / 40; // -50% over 40s

export function Marquee() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const hovered = useRef(false);
  const dir = useRef(1);

  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });

  useAnimationFrame((_, delta) => {
    if (reduce || hovered.current) return;
    const v = smooth.get();
    if (Math.abs(v) > 40) dir.current = v < 0 ? -1 : 1;
    const boost = Math.min(Math.abs(v) / 400, 4); // clamped
    let next = x.get() - dir.current * BASE_SPEED * (1 + boost) * (delta / 1000);
    if (next <= -50) next += 50;
    if (next > 0) next -= 50;
    x.set(next);
  });

  const transform = useTransform(x, (v) => `translate3d(${v}%,0,0)`);

  const group = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {t.marquee.map((item) => (
        <li key={item} className="flex items-center whitespace-nowrap">
          <span className="font-display text-4xl italic md:text-5xl">{item}</span>
          <span className="mx-8 text-gold md:mx-10" aria-hidden>
            ✦
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <section
      aria-label="Practice areas"
      className="overflow-hidden border-y border-ink/15 bg-sand py-8"
      onMouseEnter={() => (hovered.current = true)}
      onMouseLeave={() => (hovered.current = false)}
    >
      <motion.div className="flex w-max" style={{ transform }}>
        {group(false)}
        {group(true)}
      </motion.div>
    </section>
  );
}
