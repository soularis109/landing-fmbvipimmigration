import { motion, useReducedMotion } from "motion/react";
import { EASE } from "../../lib/motion";

interface Props {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  /** When provided, animation is driven by this flag; otherwise it plays once on scroll into view. */
  animate?: boolean;
}

/** Word-by-word masked reveal (inner word slides from y:110% to 0). */
export function SplitText({
  text,
  className = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.08,
  animate,
}: Props) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  const trigger =
    animate === undefined
      ? { whileInView: "show", viewport: { once: true, margin: "-10% 0px" } }
      : { animate: animate ? "show" : "hide" };

  return (
    <span className={className} aria-label={text}>
      <motion.span
        aria-hidden
        className="inline"
        initial="hide"
        {...trigger}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
      >
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
            <motion.span
              className={`inline-block ${wordClassName}`}
              variants={{
                hide: reduce ? { opacity: 0 } : { y: "110%" },
                show: reduce ? { opacity: 1 } : { y: 0 },
              }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </span>
  );
}
