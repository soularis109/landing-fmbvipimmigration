import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { EASE } from "../lib/motion";
import { useLang } from "../hooks/useLang";
import { scrollToId } from "../hooks/useLenis";
import { SOCIALS } from "../data/content";

const LETTERS = ["F", ".", "M", ".", "B", "."];

export function Footer() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  const socials = [
    { href: SOCIALS.instagram, label: "Instagram", Icon: Instagram },
    { href: SOCIALS.facebook, label: "Facebook", Icon: Facebook },
    { href: SOCIALS.linkedin, label: "LinkedIn", Icon: Linkedin },
  ];

  return (
    <footer ref={ref} className="bg-navy px-5 pb-8 pt-20 text-sand md:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div
          className="flex justify-center font-display text-[22vw] leading-[0.85]"
          aria-label="F.M.B."
        >
          {LETTERS.map((l, i) => (
            <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.05em]">
              <motion.span
                className="inline-block"
                initial={{ y: reduce ? 0 : "100%", opacity: reduce ? 0 : 1 }}
                animate={inView ? { y: 0, opacity: 1 } : undefined}
                transition={{ duration: 0.8, ease: EASE, delay: i * 0.05 }}
              >
                {l}
              </motion.span>
            </span>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-sand/15 pt-6 font-body text-sm text-sand/70 md:flex-row md:items-center">
          <p>{t.footer.rights}</p>
          <ul className="flex items-center gap-2">
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center transition-colors hover:text-gold"
                >
                  <Icon size={18} />
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => scrollToId("top")}
            className="min-h-11 transition-colors hover:text-gold"
          >
            {t.footer.top}
          </button>
        </div>
      </div>
    </footer>
  );
}
