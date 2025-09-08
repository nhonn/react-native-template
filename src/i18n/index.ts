import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { NativeModules, Platform } from "react-native";

import { logger } from "@/utils/logger";
import { storage } from "@/utils/storage";
// Import English namespaces
import enCommon from "./locales/en/common.json" with { type: "json" };
import enDate from "./locales/en/date.json" with { type: "json" };
import enErrorBoundary from "./locales/en/error_boundary.json" with { type: "json" };
import enHistory from "./locales/en/history.json" with { type: "json" };
import enScreens from "./locales/en/screens.json" with { type: "json" };

// Import Vietnamese namespaces
import viCommon from "./locales/vi/common.json" with { type: "json" };
import viDate from "./locales/vi/date.json" with { type: "json" };
import viErrorBoundary from "./locales/vi/error_boundary.json" with { type: "json" };
import viHistory from "./locales/vi/history.json" with { type: "json" };
import viScreens from "./locales/vi/screens.json" with { type: "json" };

const FALLBACK_LANGUAGE = "en" as const;
const SUPPORTED_LANGUAGES = ["en", "vi", "es", "zh"] as const;

interface DeviceLanguageConfig {
  ios: {
    primary: string;
    fallback: string;
  };
  android: {
    primary: string;
  };
}

const getDeviceLanguageConfig = (): DeviceLanguageConfig => ({
  ios: {
    primary: "AppleLocale",
    fallback: "AppleLanguages",
  },
  android: {
    primary: "localeIdentifier",
  },
});

const extractLanguageCode = (locale: string | undefined): string => {
  if (!locale || typeof locale !== "string") {
    return FALLBACK_LANGUAGE;
  }
  const languageCode = locale.split("_")[0].split("-")[0].toLowerCase();
  return SUPPORTED_LANGUAGES.includes(languageCode as Languages) ? languageCode : FALLBACK_LANGUAGE;
};

const getIOSLanguage = (): string => {
  try {
    const config = getDeviceLanguageConfig().ios;
    const settingsManager = NativeModules.SettingsManager?.settings;
    if (!settingsManager) {
      return FALLBACK_LANGUAGE;
    }
    const primaryLocale = settingsManager[config.primary];
    if (primaryLocale) {
      return extractLanguageCode(primaryLocale);
    }
    const fallbackLocales = settingsManager[config.fallback];
    if (Array.isArray(fallbackLocales) && fallbackLocales.length > 0) {
      return extractLanguageCode(fallbackLocales[0]);
    }
    return FALLBACK_LANGUAGE;
  } catch (error) {
    logger.error("Error getting iOS language:", error);
    return FALLBACK_LANGUAGE;
  }
};

const getAndroidLanguage = (): string => {
  try {
    const config = getDeviceLanguageConfig().android;
    const i18nManager = NativeModules.I18nManager;
    if (!i18nManager) {
      return FALLBACK_LANGUAGE;
    }
    const locale = i18nManager[config.primary];
    return extractLanguageCode(locale);
  } catch (error) {
    logger.error("Error getting Android language:", error);
    return FALLBACK_LANGUAGE;
  }
};

const getDeviceLanguage = (): string => {
  try {
    return Platform.OS === "ios" ? getIOSLanguage() : getAndroidLanguage();
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
    history: enHistory,
    date: enDate,
  },
  vi: {
    common: viCommon,
    screens: viScreens,
    error_boundary: viErrorBoundary,
    history: viHistory,
    date: viDate,
  },
} as const;

export type Languages = keyof typeof resources;
export type TranslationResource = typeof resources;

const i18nConfig = {
  resources,
  lng: FALLBACK_LANGUAGE,
  fallbackLng: FALLBACK_LANGUAGE,
  defaultNS: "common",
  ns: ["common", "screens", "error_boundary", "history", "date"],
  compatibilityJSON: "v4",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
} as const;

export const initializeI18n = async (): Promise<void> => {
  try {
    // Get stored language preference
    const languageResult = storage.getLanguage();
    const storedLanguage = languageResult.success ? (languageResult.data as Languages) : null;

    const selectedLanguage = storedLanguage || getDeviceLanguage();
    await i18n.use(initReactI18next).init({ ...i18nConfig, lng: selectedLanguage });
  } catch (error) {
    logger.error("Failed to initialize i18n:", error);
    await i18n.init(i18nConfig);
  }
};

export const i18nReady = initializeI18n();

export const getI18nInstance = () => i18n;

export { FALLBACK_LANGUAGE, SUPPORTED_LANGUAGES };
