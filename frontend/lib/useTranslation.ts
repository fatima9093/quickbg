"use client";

import { useLanguage } from "./language-provider";
import { useMemo } from "react";

// Import translation files
import enTranslations from "./translations/en.json";
import deTranslations from "./translations/de.json";
import frTranslations from "./translations/fr.json";
import trTranslations from "./translations/tr.json";
import esTranslations from "./translations/es.json";

type TranslationKey = string;

const translations: Record<string, any> = {
  en: enTranslations,
  de: deTranslations,
  fr: frTranslations,
  tr: trTranslations,
  es: esTranslations,
};

export function useTranslation() {
  const { language } = useLanguage();

  const t = useMemo(() => {
    const currentTranslations = translations[language] || translations.en;

    return (key: TranslationKey): string => {
      const keys = key.split(".");
      let value: any = currentTranslations;

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          // Fallback to English if translation not found
          const enValue = translations.en;
          let fallbackValue: any = enValue;
          for (const fallbackKey of keys) {
            if (fallbackValue && typeof fallbackValue === "object" && fallbackKey in fallbackValue) {
              fallbackValue = fallbackValue[fallbackKey];
            } else {
              return key; // Return key if not found in English either
            }
          }
          return typeof fallbackValue === "string" ? fallbackValue : key;
        }
      }

      return typeof value === "string" ? value : key;
    };
  }, [language]);

  return { t, language };
}

