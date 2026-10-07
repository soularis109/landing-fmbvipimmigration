import { motion, useReducedMotion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { trackEvent } from "../lib/analytics";
import { useLang } from "../hooks/useLang";
import { WHATSAPP_URL } from "../data/content";

export function WhatsAppButton({ ready }: { ready: boolean }) {
  const { t } = useLang();
  const reduce = useReducedMotion();
  if (!ready) return null;

  return (
    <motion.a
      href={`${WHATSAPP_URL}?text=${encodeURIComponent(t.whatsapp.message)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.whatsapp.aria}
      onClick={() => trackEvent("whatsapp_click", { source: "floating" })}
      className="fixed bottom-24 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
    >
      {!reduce && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-[#25D366]"
          animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
          transition={{ duration: 2.5, ease: "easeOut", repeat: Infinity }}
        />
      )}
      <MessageCircle size={28} className="relative text-white" aria-hidden />
    </motion.a>
  );
}
