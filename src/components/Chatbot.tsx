import { useEffect } from "react";
import { env, isConfigured, warnOnce } from "../lib/env";
import { trackEvent } from "../lib/analytics";

let injected = false;

/** Chatbase injects its own floating bubble (bottom-right). Mounted once at the app root. */
export function Chatbot() {
  const id = env.chatbaseId;

  useEffect(() => {
    if (!isConfigured(id)) {
      warnOnce("chatbase", "Chatbase not connected: set VITE_CHATBASE_ID in .env");
      return;
    }

    const inject = () => {
      if (injected) return;
      injected = true;
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = id;
      script.setAttribute("domain", "www.chatbase.co");
      document.body.appendChild(script);
    };

    // keep the third-party script off the critical path
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(inject);
    else setTimeout(inject, 2000);

    const onOpen = () => trackEvent("chatbot_opened");
    try {
      window.addEventListener("chatbase-opened", onOpen);
    } catch {
      /* not supported — non-critical */
    }
    return () => window.removeEventListener("chatbase-opened", onOpen);
  }, [id]);

  return null;
}
