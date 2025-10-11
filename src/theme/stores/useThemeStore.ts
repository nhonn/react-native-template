/**
 * Theme Store
 * Zustand store for theme management
 */

import React from "react";
import { Appearance, useColorScheme } from "react-native";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { BorderRadius } from "../constants/borderRadius";
import { Opacity } from "../constants/opacity";
import { Shadows } from "../constants/shadows";
import { Spacing } from "../constants/spacing";
import { Typography } from "../constants/typography";
import { darkColorScheme } from "../themes/dark";
import { lightColorScheme } from "../themes/light";
import type { Theme, ThemeConfig, ThemeMode } from "../types";

interface ThemeStoreState {
  mode: ThemeMode;
  followSystemTheme: boolean;
  defaultMode: ThemeMode;
  theme: Theme;
}

interface ThemeStoreActions {
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  resetMode: () => void;
  setConfig: (config: Partial<ThemeConfig>) => void;
  updateTheme: () => void;
}

type ThemeStore = ThemeStoreState & ThemeStoreActions;

const createTheme = (mode: ThemeMode): Theme => {
  const colorScheme = mode === "dark" ? darkColorScheme : lightColorScheme;

  return {
    mode,
    colors: colorScheme,
    typography: Typography,
    spacing: Spacing,
    borderRadius: BorderRadius,
    shadows: Shadows,
    opacity: Opacity,
  };
};

const getInitialMode = (followSystemTheme: boolean, defaultMode: ThemeMode): ThemeMode => {
  if (followSystemTheme) {
    const systemColorScheme = Appearance.getColorScheme();
    return systemColorScheme === "dark" ? "dark" : "light";
  }
  return defaultMode;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      mode: getInitialMode(true, "light"),
      followSystemTheme: true,
      defaultMode: "light",
      theme: createTheme(getInitialMode(true, "light")),

      setMode: (mode: ThemeMode) => {
        const theme = createTheme(mode);
        set({ mode, theme });
      },

      toggleMode: () => {
        const currentMode = get().mode;
        const newMode = currentMode === "light" ? "dark" : "light";
        const theme = createTheme(newMode);
        set({ mode: newMode, theme });
      },

      resetMode: () => {
        const { followSystemTheme, defaultMode } = get();
        const resetMode = followSystemTheme ? getInitialMode(followSystemTheme, defaultMode) : defaultMode;
        const theme = createTheme(resetMode);
        set({ mode: resetMode, theme });
      },

      setConfig: (config: Partial<ThemeConfig>) => {
        const { followSystemTheme, defaultMode } = get();
        const newFollowSystemTheme = config.followSystemTheme ?? followSystemTheme;
        const newDefaultMode = config.defaultMode ?? defaultMode;

        let newMode = get().mode;

        if (config.followSystemTheme !== undefined || config.defaultMode !== undefined) {
          newMode = getInitialMode(newFollowSystemTheme, newDefaultMode);
        }

        const theme = createTheme(newMode);
        set({
          followSystemTheme: newFollowSystemTheme,
          defaultMode: newDefaultMode,
          mode: newMode,
          theme,
        });
      },

      updateTheme: () => {
        const { followSystemTheme } = get();
        if (followSystemTheme) {
          const systemColorScheme = Appearance.getColorScheme();
          const systemMode = systemColorScheme === "dark" ? "dark" : "light";
          if (systemMode !== get().mode) {
            const theme = createTheme(systemMode);
            set({ mode: systemMode, theme });
          }
        }
      },
    }),
    {
      name: "theme-store",
      partialize: (state) => ({
        mode: state.mode,
        followSystemTheme: state.followSystemTheme,
        defaultMode: state.defaultMode,
      }),
    },
  ),
);

// Hook to initialize system theme tracking
export function useSystemThemeTracking() {
  const systemColorScheme = useColorScheme();
  const { followSystemTheme, updateTheme } = useThemeStore();

  React.useEffect(() => {
    if (followSystemTheme) {
      updateTheme();
    }
  }, [followSystemTheme, systemColorScheme, updateTheme]);

  React.useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (followSystemTheme && colorScheme) {
        const systemMode = colorScheme === "dark" ? "dark" : "light";
        const { mode } = useThemeStore.getState();

        if (systemMode !== mode) {
          const theme = createTheme(systemMode);
          useThemeStore.setState({ mode: systemMode, theme });
        }
      }
    });

    return () => subscription?.remove();
  }, [followSystemTheme]);
}
