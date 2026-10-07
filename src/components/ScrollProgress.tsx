import { motion, useScroll } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[60] h-0.5 origin-left bg-gold"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
