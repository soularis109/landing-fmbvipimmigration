import { useState } from "react";
import { motion } from "motion/react";
import { LottieIcon } from "./ui/LottieIcon";
import { SPRING } from "../lib/motion";
import type { ServiceItem } from "../data/content";

const CATEGORY_ICON = {
  citizenship: "passport-stamp",
  residency: "document-check",
  business: "building",
  lifestyle: "plane",
} as const;

interface Props {
  item: ServiceItem;
  number: string;
  learnMore: string;
}

export function ServiceCard({ item, number, learnMore }: Props) {
  const [hovered, setHovered] = useState(false);
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      transition={{ ...SPRING, opacity: { duration: 0.3 } }}
      onMouseMove={onMove}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-2xl border border-sand/10 bg-navy-2 p-8 transition-colors duration-300 hover:border-gold/40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(400px at var(--x, 50%) var(--y, 50%), rgba(201,165,90,0.15), transparent)",
        }}
      />
      <div className="relative">
        <div className="flex items-start justify-between">
          <span className="font-display text-xl text-gold">{number}</span>
          <LottieIcon name={CATEGORY_ICON[item.category]} mode="hover" trigger={hovered} className="h-8 w-8" />
        </div>
        <h3 className="mt-6 font-display text-3xl leading-tight">{item.title}</h3>
        <p className="mt-4 font-body text-sm leading-relaxed text-sand/70">{item.text}</p>
      </div>
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="relative mt-8 w-fit font-body text-sm text-gold after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-500 group-hover:after:scale-x-100"
      >
        {learnMore}
        <span className="sr-only"> — {item.title}</span>
      </a>
    </motion.article>
  );
}
