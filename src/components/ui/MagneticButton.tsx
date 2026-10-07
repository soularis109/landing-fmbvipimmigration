import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useFinePointer } from "../../hooks/useMediaQuery";

interface Props {
  children: ReactNode;
  className?: string;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  strength?: number;
  ariaLabel?: string;
  type?: "button" | "submit";
}

/** Button/link that leans toward the cursor. Falls back to a plain element on touch / reduced motion. */
export function MagneticButton({
  children,
  className = "",
  href,
  external,
  onClick,
  strength = 0.3,
  ariaLabel,
  type = "button",
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const active = fine && !reduce;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 200, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 200, damping: 18, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    if (!active || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * strength);
    my.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const common = {
    className: `inline-flex items-center justify-center min-h-11 ${className}`,
    style: active ? { x, y } : undefined,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    "aria-label": ariaLabel,
  };

  if (href) {
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        onClick={onClick}
        {...common}
      >
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      {...common}
    >
      {children}
    </motion.button>
  );
}
