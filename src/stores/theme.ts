import { Appearance } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { ThemeMode } from "@/theme/tokens";
import { secureStorage } from "@/utils/mmkv";

interface ThemeState {
  theme: ThemeMode;
  systemTheme: ThemeMode;
  useSystemTheme: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  setUseSystemTheme: (useSystem: boolean) => void;
  getEffectiveTheme: () => ThemeMode;
}

// Get system theme
const getSystemTheme = (): ThemeMode => {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === "dark" ? "dark" : "light";
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      systemTheme: getSystemTheme(),
      useSystemTheme: false,

      toggleTheme: () => {
        const currentTheme = get().getEffectiveTheme();
        const newTheme = currentTheme === "light" ? "dark" : "light";
        set({ theme: newTheme, useSystemTheme: false });
      },

      setTheme: (theme: ThemeMode) => {
        set({ theme, useSystemTheme: false });
      },

      setUseSystemTheme: (useSystem: boolean) => {
        set({
          useSystemTheme: useSystem,
          systemTheme: getSystemTheme(),
        });
      },

      getEffectiveTheme: () => {
        const state = get();
        return state.useSystemTheme ? state.systemTheme : state.theme;
      },
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => ({
        setItem: (name, value) => {
          secureStorage.setString(name, value);
        },
        getItem: (name) => {
          return secureStorage.getString(name) ?? null;
        },
        removeItem: (name) => {
          secureStorage.removeItem(name);
        },
      })),
    },
  ),
);

// Listen to system theme changes
Appearance.addChangeListener(({ colorScheme }) => {
  const systemTheme = colorScheme === "dark" ? "dark" : "light";
  useThemeStore.setState({ systemTheme });
});
