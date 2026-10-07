import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SPRING } from "../lib/motion";
import { useLang } from "../hooks/useLang";
import { SplitText } from "./ui/SplitText";
import { ServiceCard } from "./ServiceCard";
import type { ServiceCategory } from "../data/content";

export function Services() {
  const { t } = useLang();
  const [filter, setFilter] = useState<"all" | ServiceCategory>("all");
  const { items, filters, learnMore } = t.services;

  return (
    <section id="services" aria-labelledby="services-title" className="bg-navy px-5 py-20 text-sand md:px-12 md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <p className="eyebrow mb-6">{t.services.eyebrow}</p>
        <h2 id="services-title" className="h2-display max-w-4xl">
          <SplitText text={t.services.title} />
        </h2>

        <div role="tablist" aria-label={t.services.eyebrow} className="mt-12 flex flex-wrap gap-2">
          {filters.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.id)}
                className={`relative min-h-11 rounded-full px-5 font-body text-sm transition-colors ${active ? "text-navy" : "text-sand/70 hover:text-sand"}`}
              >
                {active && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-full bg-gold"
                    transition={SPRING}
                  />
                )}
                <span className="relative">{f.label}</span>
              </button>
            );
          })}
        </div>

        <motion.div layout className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {items.map((item, i) =>
              filter === "all" || item.category === filter ? (
                <ServiceCard
                  key={item.id}
                  item={item}
                  number={String(i + 1).padStart(2, "0")}
                  learnMore={learnMore}
                />
              ) : null,
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
