import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { NativeModules, Platform } from "react-native";

import { logger } from "@/utils/logger";
import { storage } from "@/utils/storage";
import en from "./locales/en.json" with { type: "json" };
import vi from "./locales/vi.json" with { type: "json" };

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
  en: { translation: en },
  vi: { translation: vi },
} as const;

export type Languages = keyof typeof resources;
export type TranslationResource = typeof resources;

const i18nConfig = {
  resources,
  lng: FALLBACK_LANGUAGE,
  fallbackLng: FALLBACK_LANGUAGE,
  compatibilityJSON: "v4",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
} as const;

export const initializeI18n = async () => {
  try {
    const lng = await storage.getLanguage().then((result) => result.data as Languages);
    await i18n.use(initReactI18next).init({ ...i18nConfig, lng: lng || getDeviceLanguage() });
  } catch (error) {
    logger.error("Failed to initialize i18n:", error);
    await i18n.init(i18nConfig);
  }
};

export const i18nReady = initializeI18n();

export const getI18nInstance = () => i18n;

export { FALLBACK_LANGUAGE, SUPPORTED_LANGUAGES };
