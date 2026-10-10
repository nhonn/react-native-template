import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { logger } from "@/utils/logger";
import { StorageKeys, storage } from "@/utils/storage";
// Import English namespaces
import enCommon from "./locales/en/common.json" with { type: "json" };
import enDate from "./locales/en/date.json" with { type: "json" };
import enErrorBoundary from "./locales/en/error_boundary.json" with { type: "json" };
import enScreens from "./locales/en/screens.json" with { type: "json" };

const FALLBACK_LANGUAGE = "en" as const;
const SUPPORTED_LANGUAGES = ["en"] as const;

const extractLanguageCode = (locale: string | undefined): string => {
  if (!locale || typeof locale !== "string") {
    return FALLBACK_LANGUAGE;
  }
  const languageCode = locale.split("_")[0].split("-")[0].toLowerCase();
  return SUPPORTED_LANGUAGES.includes(languageCode as Languages) ? languageCode : FALLBACK_LANGUAGE;
};

const getDeviceLanguage = (): string => {
  try {
    const [deviceLocale] = getLocales();
    return extractLanguageCode(deviceLocale?.languageCode ?? undefined);
  } catch (error) {
    logger.error("Error getting device language:", error);
    return FALLBACK_LANGUAGE;
  }
};

export const resources = {
  en: {
    common: enCommon,
    screens: enScreens,
    error_boundary: enErrorBoundary,
    date: enDate,
  },
} as const;

export type Languages = keyof typeof resources;
export type TranslationResource = typeof resources;

const i18nConfig = {
  resources,
  lng: FALLBACK_LANGUAGE,
  fallbackLng: FALLBACK_LANGUAGE,
  defaultNS: "common",
  ns: ["common", "screens", "error_boundary", "date"],
  compatibilityJSON: "v4",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
} as const;

const isSupportedLanguage = (language: string | undefined): language is Languages =>
  SUPPORTED_LANGUAGES.includes(language as Languages);

export const initializeI18n = async (): Promise<string> => {
  try {
    const storedLanguage = storage.getString(StorageKeys.LANGUAGE);
    const selectedLanguage = isSupportedLanguage(storedLanguage) ? storedLanguage : getDeviceLanguage();
    await i18n.use(initReactI18next).init({ ...i18nConfig, lng: selectedLanguage });
  } catch (error) {
    logger.error("Failed to initialize i18n:", error);
    await i18n.init(i18nConfig);
  }
  return i18n.language;
};

/**
 * Switches the active language and persists it to the key read by
 * `initializeI18n`. Prefer `useSettingsStore.getState().setLanguage`, which
 * also keeps `settings$` in sync.
 */
export const setAppLanguage = async (language: string): Promise<void> => {
  if (!isSupportedLanguage(language)) {
    logger.warn("Unsupported language:", language);
    return;
  }
  storage.setString(StorageKeys.LANGUAGE, language);
  await i18n.changeLanguage(language);
};

export const getI18nInstance = () => i18n;

export { FALLBACK_LANGUAGE, SUPPORTED_LANGUAGES };
