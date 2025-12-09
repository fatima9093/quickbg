"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "de" | "fr" | "tr" | "es";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  getLanguageName: (lang: Language) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const languages: Record<Language, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  tr: "Türkçe",
  es: "Español",
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage for saved language preference
    const savedLanguage = localStorage.getItem("language") as Language | null;
    if (savedLanguage && languages[savedLanguage]) {
      setLanguageState(savedLanguage);
      document.documentElement.setAttribute("lang", savedLanguage);
    } else {
      // Check browser language
      const browserLang = navigator.language.split("-")[0] as Language;
      const initialLang = languages[browserLang] ? browserLang : "en";
      setLanguageState(initialLang);
      document.documentElement.setAttribute("lang", initialLang);
      localStorage.setItem("language", initialLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
      document.documentElement.setAttribute("lang", lang);
    }
  };

  const getLanguageName = (lang: Language) => languages[lang];

  // Always provide context, even during SSR
  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    getLanguageName,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

