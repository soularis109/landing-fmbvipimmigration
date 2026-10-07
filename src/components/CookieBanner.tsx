import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "../lib/motion";
import { useLang } from "../hooks/useLang";
import { getConsent, setConsent, startAnalyticsIfAllowed } from "../lib/consent";

export function CookieBanner({ ready }: { ready: boolean }) {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    startAnalyticsIfAllowed(); // returning visitor who already accepted
    setVisible(getConsent() === null);
  }, []);

  const choose = (v: "granted" | "denied") => {
    setConsent(v);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {ready && visible && (
        <motion.div
          role="region"
          aria-label="Cookies"
          className="fixed bottom-4 left-4 right-4 z-[65] max-w-md rounded-2xl border border-sand/15 bg-navy p-5 text-sand shadow-xl md:right-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.4 }}
        >
          <p className="font-body text-sm leading-relaxed text-sand/80">{t.cookie.text}</p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => choose("granted")}
              className="min-h-11 rounded-full bg-gold px-6 font-body text-sm font-semibold text-navy"
            >
              {t.cookie.accept}
            </button>
            <button
              type="button"
              onClick={() => choose("denied")}
              className="min-h-11 rounded-full border border-sand/30 px-6 font-body text-sm text-sand"
            >
              {t.cookie.decline}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
