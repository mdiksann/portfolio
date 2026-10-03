"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import { translations, type Language } from "@/lib/translations";

type NestedTranslationKey = string;

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: NestedTranslationKey, fallback?: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

let sessionLanguage: Language | undefined;

function getClientLanguage(): Language {
  if (typeof window === "undefined") return "en";
  if (sessionLanguage) return sessionLanguage;
  try {
    const saved = localStorage.getItem("portfolio_lang");
    if (saved === "en" || saved === "id") return saved;
    const match = document.cookie.match(/(?:^|;\s*)portfolio_lang=(en|id)/);
    if (match && (match[1] === "en" || match[1] === "id"))
      return match[1] as Language;
  } catch {
    // Fallback
  }
  return "en";
}

function getServerLanguage(): Language {
  return "en";
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const onStorage = () => {
    sessionLanguage = undefined;
    callback();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener("portfolio_lang_change", callback);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("portfolio_lang_change", callback);
  };
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(
    subscribe,
    getClientLanguage,
    getServerLanguage,
  );

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (newLang: Language) => {
    sessionLanguage = newLang;
    try {
      localStorage.setItem("portfolio_lang", newLang);
    } catch {
      // The switch still works when browser storage is unavailable.
    }
    try {
      document.cookie = `portfolio_lang=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // Cookies may also be disabled.
    }
    window.dispatchEvent(new Event("portfolio_lang_change"));
  };

  const toggleLang = () => {
    setLang(lang === "en" ? "id" : "en");
  };

  const t = (key: NestedTranslationKey, fallback?: string): string => {
    const keys = key.split(".");
    let current: unknown = translations[lang];

    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = (current as Record<string, unknown>)[k];
      } else {
        return fallback || key;
      }
    }

    return typeof current === "string" ? current : fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      lang: "en" as Language,
      setLang: () => {},
      toggleLang: () => {},
      t: (key: NestedTranslationKey, fallback?: string): string => {
        const keys = key.split(".");
        let current: unknown = translations["en"];
        for (const k of keys) {
          if (current && typeof current === "object" && k in current) {
            current = (current as Record<string, unknown>)[k];
          } else {
            return fallback || key;
          }
        }
        return typeof current === "string" ? current : fallback || key;
      },
    };
  }
  return context;
}
