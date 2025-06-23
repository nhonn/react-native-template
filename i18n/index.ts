import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { NativeModules, Platform } from 'react-native';

import en from './locales/en.json';
import vi from './locales/vi.json';

const getDeviceLanguage = (): string => {
  let deviceLanguage = 'en';

  try {
    // We no longer check saved language synchronously here; LanguageProvider will handle it later
    // Get device language
    if (Platform.OS === 'ios') {
      const locale =
        NativeModules.SettingsManager?.settings?.AppleLocale ||
        NativeModules.SettingsManager?.settings?.AppleLanguages?.[0];
      deviceLanguage = locale?.split('_')[0] || 'en';
    } else {
      deviceLanguage =
        NativeModules.I18nManager?.localeIdentifier?.split('_')[0] || 'en';
    }
  } catch (error) {
    console.error('Error getting device language:', error);
  }

  return deviceLanguage;
};

export const resources = {
  en: {translation: en},
  vi: {translation: vi},
} as const;

export type Languages = keyof typeof resources;
export type TranslationResource = typeof resources;

// Single responsibility to init i18n
i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: 'en',
  compatibilityJSON: 'v4',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
