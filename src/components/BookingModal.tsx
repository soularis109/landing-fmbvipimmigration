import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { CalendarX, X } from "lucide-react";
import { EASE } from "../lib/motion";
import { env, isConfigured, warnOnce } from "../lib/env";
import { useLang } from "../hooks/useLang";
import { lenisStart, lenisStop } from "../hooks/useLenis";

export default function BookingModal({ onClose }: { onClose: () => void }) {
  const { t } = useLang();
  const closeRef = useRef<HTMLButtonElement>(null);
  const calLink = env.calLink;
  const connected = isConfigured(calLink);

  // Cal brand styling
  useEffect(() => {
    if (!connected) {
      warnOnce("cal", "Cal.com not connected: set VITE_CAL_LINK in .env");
      return;
    }
    (async () => {
      const cal = await getCalApi();
      cal("ui", { theme: "light", styles: { branding: { brandColor: "#C9A55A" } } });
    })();
  }, [connected]);

  // scroll lock, Esc, focus handling
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    lenisStop();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      lenisStart();
      prevFocus?.focus?.();
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-navy/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-lenis-prevent
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={t.booking.title}
        className="relative h-[80vh] w-[92vw] max-w-3xl overflow-hidden rounded-2xl bg-ivory shadow-2xl"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t.booking.close}
          className="group absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-ivory/90 text-ink shadow"
        >
          <X size={20} className="transition-transform duration-300 group-hover:rotate-90" />
        </button>

        {connected ? (
          <Cal
            calLink={calLink}
            style={{ width: "100%", height: "100%", overflow: "scroll" }}
            config={{ layout: "month_view" }}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
            <CalendarX size={56} strokeWidth={1} className="text-gold" aria-hidden />
            <p className="max-w-sm font-body text-base text-ink/60">{t.booking.notConnected}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
