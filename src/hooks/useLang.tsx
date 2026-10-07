import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { content, type Lang } from "../data/content";

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (typeof content)["en"];
}

const Ctx = createContext<LangCtx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = content[lang].meta.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", content[lang].meta.description);
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t: content[lang] }), [lang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLang must be used inside LangProvider");
  return v;
}
