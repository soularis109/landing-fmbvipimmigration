import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { trackEvent } from "../lib/analytics";

export type BookingSource = "hero" | "header" | "contact";

interface BookingCtx {
  isOpen: boolean;
  open: (source: BookingSource) => void;
  close: () => void;
}

const Ctx = createContext<BookingCtx | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);

  const open = useCallback((source: BookingSource) => {
    setOpen(true);
    trackEvent("booking_opened");
    trackEvent("booking_source", { source });
  }, []);
  const close = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBooking() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useBooking must be used inside BookingProvider");
  return v;
}
