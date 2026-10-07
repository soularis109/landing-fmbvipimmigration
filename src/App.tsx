import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { LangProvider, useLang } from "./hooks/useLang";
import { BookingProvider, useBooking } from "./hooks/useBooking";
import { lenisStart, lenisStop, useLenisInit } from "./hooks/useLenis";
import { Preloader } from "./components/Preloader";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { GoldenVisa } from "./components/GoldenVisa";
import { Process } from "./components/Process";
import { Regions } from "./components/Regions";
import { EvaluationCTA } from "./components/EvaluationCTA";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { CustomCursor } from "./components/CustomCursor";
import { ScrollProgress } from "./components/ScrollProgress";
import { Grain } from "./components/Grain";
import { Chatbot } from "./components/Chatbot";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { CookieBanner } from "./components/CookieBanner";

const BookingModal = lazy(() => import("./components/BookingModal"));

function Page() {
  const { lang } = useLang();
  const booking = useBooking();
  const reduce = useReducedMotion();
  const [counted, setCounted] = useState(!!reduce);
  const [ready, setReady] = useState(!!reduce);

  useLenisInit(!reduce);

  // lock scroll while the preloader is visible
  useEffect(() => {
    if (!counted) {
      lenisStop();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      lenisStart();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [counted]);

  const onCounted = useCallback(() => setCounted(true), []);

  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      <Grain />
      <AnimatePresence onExitComplete={() => setReady(true)}>
        {!counted && <Preloader key="preloader" onCounted={onCounted} />}
      </AnimatePresence>
      <Header />
      <main key={lang}>
        <Hero ready={ready} />
        <Marquee />
        <About />
        <Services />
        <GoldenVisa />
        <Process />
        <Regions />
        <EvaluationCTA />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
      <WhatsAppButton ready={ready} />
      <CookieBanner ready={ready} />
      <AnimatePresence>
        {booking.isOpen && (
          <Suspense fallback={null}>
            <BookingModal key="booking" onClose={booking.close} />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <LangProvider>
      <BookingProvider>
        <Page />
      </BookingProvider>
    </LangProvider>
  );
}
