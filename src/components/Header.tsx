import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Phone } from "lucide-react";
import { EASE } from "../lib/motion";
import { useLang } from "../hooks/useLang";
import { scrollToId } from "../hooks/useLenis";
import { useBooking } from "../hooks/useBooking";
import { trackEvent } from "../lib/analytics";
import { WHATSAPP_URL, type Lang } from "../data/content";

const SAND = "#F5F0E6";
const INK = "#10141A";

function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`flex items-center gap-2 font-body text-xs tracking-[0.2em] ${className}`}>
      {(["en", "ru"] as Lang[]).map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && <span className="opacity-40">/</span>}
          <button
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            className={`min-h-11 min-w-8 uppercase transition-opacity ${lang === l ? "opacity-100 text-gold" : "opacity-60 hover:opacity-100"}`}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}

export function Header() {
  const { t } = useLang();
  const booking = useBooking();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 80);
    setHidden(y > prev && y > 200);
  });

  const go = (id: string) => {
    setOpen(false);
    // let the menu overlay unmount first so Lenis can scroll
    setTimeout(() => scrollToId(id), open ? 50 : 0);
  };

  const light = scrolled && !open;

  return (
    <>
      <motion.header
        className="fixed top-0 inset-x-0 z-50 h-20"
        animate={{ y: hidden && !open ? "-100%" : 0, color: light ? INK : SAND }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <motion.div
          aria-hidden
          className="absolute inset-0 border-b border-ink/15 bg-sand/80 backdrop-blur-md"
          animate={{ opacity: light ? 1 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        />
        <div className="relative mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 md:px-12">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              go("top");
            }}
            className="leading-none"
            aria-label="F.M.B. VIP Immigration — top"
          >
            <span className="block font-display text-[28px] leading-none">F.M.B.</span>
            <span className="mt-1 block font-body text-[0.55rem] tracking-[0.3em] opacity-70">
              {t.header.wordmarkSub}
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-10" aria-label="Primary">
            {t.header.nav.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(n.id);
                }}
                className="group relative py-2 font-body text-sm tracking-wide"
              >
                {n.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 ease-out group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-5">
            <LangSwitch />
            <a
              href="tel:+35799445099"
              aria-label={t.header.callAria}
              className="flex h-11 w-11 items-center justify-center"
            >
              <Phone size={18} />
            </a>
            <button
              type="button"
              onClick={() => booking.open("header")}
              className="hidden lg:inline-flex min-h-11 items-center rounded-full border border-current/40 px-5 font-body text-sm"
            >
              {t.booking.bookCall}
            </button>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("whatsapp_click", { source: "header" })}
              className="hidden md:inline-flex min-h-11 items-center rounded-full bg-gold px-5 font-body text-sm font-semibold text-navy"
            >
              {t.header.whatsapp}
            </a>
            <button
              type="button"
              className="md:hidden flex h-11 w-11 flex-col items-center justify-center gap-1.5"
              aria-label={open ? t.header.close : t.header.menu}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <motion.span
                className="h-px w-6 bg-current"
                animate={{ rotate: open ? 45 : 0, y: open ? 3.5 : 0 }}
              />
              <motion.span
                className="h-px w-6 bg-current"
                animate={{ rotate: open ? -45 : 0, y: open ? -3.5 : 0 }}
              />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center bg-navy px-6 text-sand md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <ul className="flex flex-col gap-4">
              {t.header.nav.map((n, i) => (
                <motion.li
                  key={n.id}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.1 + i * 0.08 }}
                >
                  <a
                    href={`#${n.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(n.id);
                    }}
                    className="block font-display text-[48px] leading-tight"
                  >
                    {n.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.button
              type="button"
              onClick={() => {
                setOpen(false);
                booking.open("header");
              }}
              className="mt-10 inline-flex min-h-11 w-fit items-center rounded-full border border-sand/40 px-6 font-body text-sm"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.45 }}
            >
              {t.booking.bookCall}
            </motion.button>
            <motion.a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("whatsapp_click", { source: "header" })}
              className="mt-4 inline-flex min-h-11 w-fit items-center rounded-full bg-gold px-6 font-body text-sm font-semibold text-navy"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
            >
              {t.header.whatsapp}
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
