import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { EASE } from "../lib/motion";
import { useLang } from "../hooks/useLang";
import { SplitText } from "./ui/SplitText";
import { StatCounter } from "./StatCounter";
import { Photo } from "./ui/Photo";

function Word({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {word}&nbsp;
    </motion.span>
  );
}

/** "Reading highlight": each word goes 0.15 → 1 opacity as the paragraph scrolls through. */
function HighlightParagraph({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });
  const words = text.split(" ");

  if (reduce) return <p className="body-copy text-ink/75">{text}</p>;
  return (
    <p ref={ref} className="body-copy text-ink/90" aria-label={text}>
      <span aria-hidden>
        {words.map((w, i) => (
          <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
        ))}
      </span>
    </p>
  );
}

export function About() {
  const { t } = useLang();
  const reduce = useReducedMotion();

  return (
    <section id="about" aria-labelledby="about-title" className="bg-sand px-5 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="eyebrow mb-6">{t.about.eyebrow}</p>
            <h2 id="about-title" className="h2-display mb-12">
              <SplitText text={t.about.title} />
            </h2>
            <div className="max-w-2xl space-y-8">
              {t.about.paragraphs.map((p) => (
                <HighlightParagraph key={p} text={p} />
              ))}
            </div>
          </div>
          <div className="md:col-span-5 md:pl-8">
            {t.about.stats.map((s, i) => (
              <StatCounter
                key={s.label}
                value={s.value}
                suffix={s.suffix}
                label={s.label}
                watermark={i === 0 ? "passport-ticket" : undefined}
              />
            ))}
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((n, i) => (
            <motion.div
              key={n}
              className="group overflow-hidden rounded-lg"
              initial={{ clipPath: reduce ? "inset(0)" : "inset(100% 0 0 0)", opacity: reduce ? 0 : 1 }}
              whileInView={{ clipPath: "inset(0)", opacity: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: reduce ? 0.6 : 1, ease: EASE, delay: i * 0.12 }}
            >
              <Photo
                src={`/images/office-${n}.jpg`}
                alt={t.about.photoAlts[i]}
                width={523}
                height={393}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
