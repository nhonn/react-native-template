import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ValidDateFormat } from "@/types/date";
import { createMMKVJSONStorage } from "@/utils/storage";

export type TextSizePreference = "smaller" | "default" | "bigger";

export interface ZustandSettings {
  premium: boolean;
}

export interface PersistentSettings {
  // UI preferences that enhance UX
  isTablet: boolean;
  language: string;

  // Display preferences
  dateFormat: ValidDateFormat;
  textSizePreference: TextSizePreference;
}

export interface SettingsState extends ZustandSettings, PersistentSettings {
  // Specific actions
  setIsPremium: (isPremium: boolean) => void;
  setIsTablet: (isTablet: boolean) => void;
  setLanguage: (language: string) => void;
  setDateFormat: (format: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY/MM/DD") => void;
  setTextSizePreference: (preference: TextSizePreference) => void;
}

const defaultZustandSettings: ZustandSettings = {
  premium: false,
};

const defaultPersistentSettings: PersistentSettings = {
  isTablet: false,
  language: "en",
  // Display preferences
  dateFormat: "DD/MM/YYYY",
  textSizePreference: "default",
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultZustandSettings,
      ...defaultPersistentSettings,

      setIsPremium: (isPremium) => {
        set({ premium: isPremium });
      },

      setIsTablet: (isTablet) => {
        set({ isTablet });
      },

      setLanguage: (language) => {
        set({ language });
      },

      setDateFormat: (format) => {
        set({ dateFormat: format });
      },

      setTextSizePreference: (preference) => {
        set({ textSizePreference: preference });
      },
    }),
    {
      name: "settings",
      storage: createMMKVJSONStorage(),
      partialize: (state) => ({
        isTablet: state.isTablet,
        language: state.language,
        dateFormat: state.dateFormat,
        textSizePreference: state.textSizePreference,
      }),
    },
  ),
);
