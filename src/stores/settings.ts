import { observable } from "@legendapp/state";
import { observablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";
import { syncObservable } from "@legendapp/state/sync";
import { useSelector } from "@legendapp/state/react";

import { setAppLanguage } from "@/i18n";
import type { TextSizePreference } from "@/theme/types";
import type { ValidDateFormat } from "@/types/date";

export interface RuntimeSettings {
  premium: boolean;
}

export interface PersistentSettings {
  isTablet: boolean;
  language: string;
  dateFormat: ValidDateFormat;
  textSizePreference: TextSizePreference;
}

export interface SettingsActions {
  setIsPremium: (isPremium: boolean) => void;
  setIsTablet: (isTablet: boolean) => void;
  setLanguage: (language: string) => void;
  setDateFormat: (format: ValidDateFormat) => void;
  setTextSizePreference: (preference: TextSizePreference) => void;
}

export interface SettingsState extends RuntimeSettings, PersistentSettings, SettingsActions {}

const defaultRuntimeSettings: RuntimeSettings = {
  premium: false,
};

const defaultPersistentSettings: PersistentSettings = {
  isTablet: false,
  language: "en",
  dateFormat: "DD/MM/YYYY",
  textSizePreference: "default",
};

export const settings$ = observable<RuntimeSettings & PersistentSettings>({
  ...defaultRuntimeSettings,
  ...defaultPersistentSettings,
});

syncObservable(settings$, {
  persist: {
    name: "settings",
    plugin: observablePersistMMKV({ id: "obsPersist" }),
    transform: {
      save: (value) => {
        const { premium: _premium, ...persisted } = value;
        return persisted as typeof value;
      },
    },
  },
});

const settingsActions: SettingsActions = {
  setIsPremium: (isPremium) => {
    settings$.premium.set(isPremium);
  },
  setIsTablet: (isTablet) => {
    settings$.isTablet.set(isTablet);
  },
  setLanguage: (language) => {
    settings$.language.set(language);
    void setAppLanguage(language);
  },
  setDateFormat: (format) => {
    settings$.dateFormat.set(format);
  },
  setTextSizePreference: (preference) => {
    settings$.textSizePreference.set(preference);
  },
};

const getSettingsState = (): SettingsState => ({
  ...settings$.get(),
  ...settingsActions,
});

type SettingsStoreHook = {
  (): SettingsState;
  <T>(selector: (state: SettingsState) => T): T;
  getState: () => SettingsState;
};

export const useSettingsStore = Object.assign(
  function useSettingsStore<T = SettingsState>(selector?: (state: SettingsState) => T) {
    return useSelector(() => {
      const state = getSettingsState();
      return (selector ? selector(state) : state) as T;
    });
  },
  { getState: getSettingsState },
) as SettingsStoreHook;
