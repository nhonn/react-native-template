/**
 * Theme Store
 * Legend State observable for theme management
 */

import { computed, when } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";
import { useSelector } from "@legendapp/state/react";
import React from "react";
import { Appearance, useColorScheme } from "react-native";
import { Uniwind } from "uniwind";

import { ObservablePersistMMKVNative } from "@/utils/legend-persist";
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

export const themePrefs$ = persistObservable(
  {
    mode: getInitialMode(true, "light"),
    followSystemTheme: true,
    defaultMode: "light" as ThemeMode,
  },
  {
    local: "theme-store",
    pluginLocal: ObservablePersistMMKVNative,
  },
);

export const theme$ = computed(() => createTheme(themePrefs$.mode.get()));

when(
  () => Boolean(themePrefs$._state?.isLoaded.get()),
  () => {
    Uniwind.setTheme(themePrefs$.mode.get());
  },
);

const applyMode = (mode: ThemeMode) => {
  themePrefs$.mode.set(mode);
  Uniwind.setTheme(mode);
};

const themeActions: ThemeStoreActions = {
  setMode: (mode) => {
    applyMode(mode);
  },

  toggleMode: () => {
    applyMode(themePrefs$.mode.get() === "light" ? "dark" : "light");
  },

  resetMode: () => {
    const { followSystemTheme, defaultMode } = themePrefs$.get();
    applyMode(followSystemTheme ? getInitialMode(followSystemTheme, defaultMode) : defaultMode);
  },

  setConfig: (config) => {
    const current = themePrefs$.get();
    const followSystemTheme = config.followSystemTheme ?? current.followSystemTheme;
    const defaultMode = config.defaultMode ?? current.defaultMode;
    const shouldRecalculateMode = config.followSystemTheme !== undefined || config.defaultMode !== undefined;

    themePrefs$.followSystemTheme.set(followSystemTheme);
    themePrefs$.defaultMode.set(defaultMode);

    if (shouldRecalculateMode) {
      applyMode(getInitialMode(followSystemTheme, defaultMode));
    }
  },

  updateTheme: () => {
    if (!themePrefs$.followSystemTheme.get()) {
      return;
    }

    const systemMode = Appearance.getColorScheme() === "dark" ? "dark" : "light";
    if (systemMode !== themePrefs$.mode.get()) {
      applyMode(systemMode);
    }
  },
};

const getThemeState = (): ThemeStore => ({
  ...themePrefs$.get(),
  theme: theme$.get(),
  ...themeActions,
});

type ThemeStoreHook = {
  (): ThemeStore;
  <T>(selector: (state: ThemeStore) => T): T;
  getState: () => ThemeStore;
  setState: (partial: Partial<ThemeStoreState>) => void;
};

export const useThemeStore = Object.assign(
  function useThemeStore<T = ThemeStore>(selector?: (state: ThemeStore) => T) {
    return useSelector(() => {
      const state = getThemeState();
      return (selector ? selector(state) : state) as T;
    });
  },
  {
    getState: getThemeState,
    setState: (partial: Partial<ThemeStoreState>) => {
      if (partial.followSystemTheme !== undefined) {
        themePrefs$.followSystemTheme.set(partial.followSystemTheme);
      }
      if (partial.defaultMode !== undefined) {
        themePrefs$.defaultMode.set(partial.defaultMode);
      }
      if (partial.mode !== undefined) {
        applyMode(partial.mode);
      }
    },
  },
) as ThemeStoreHook;

export function useSystemThemeTracking() {
  const systemColorScheme = useColorScheme();
  const followSystemTheme = useSelector(() => themePrefs$.followSystemTheme.get());

  React.useEffect(() => {
    if (followSystemTheme) {
      themeActions.updateTheme();
    }
  }, [followSystemTheme, systemColorScheme]);

  React.useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (followSystemTheme && colorScheme) {
        const systemMode = colorScheme === "dark" ? "dark" : "light";
        if (systemMode !== themePrefs$.mode.get()) {
          applyMode(systemMode);
        }
      }
    });

    return () => subscription.remove();
  }, [followSystemTheme]);
}
