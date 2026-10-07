import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useFinePointer } from "../hooks/useMediaQuery";

export function CustomCursor() {
  const fine = useFinePointer();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 220, damping: 22, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 220, damping: 22, mass: 0.5 });
  const [big, setBig] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!fine) return;
    document.documentElement.classList.add("has-custom-cursor");
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setShown(true);
    };
    const over = (e: MouseEvent) => {
      const el = e.target as Element | null;
      setBig(!!el?.closest("a, button, select, [data-cursor]"));
    };
    const leave = () => setShown(false);
    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [fine, x, y]);

  if (!fine) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]" style={{ opacity: shown ? 1 : 0 }}>
      <motion.div
        className="absolute top-0 left-0 h-1.5 w-1.5 rounded-full bg-gold"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        className="absolute top-0 left-0 h-9 w-9 rounded-full border border-gold/70"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: big ? 1.8 : 1 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}
