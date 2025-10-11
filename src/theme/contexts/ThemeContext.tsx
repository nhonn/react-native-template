import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Appearance, useColorScheme } from "react-native";

import { BorderRadius } from "../constants/borderRadius";
import { Opacity } from "../constants/opacity";
import { Shadows } from "../constants/shadows";
import { Spacing } from "../constants/spacing";
import { Typography } from "../constants/typography";
import { darkColorScheme } from "../themes/dark";
import { lightColorScheme } from "../themes/light";
import type { Theme, ThemeContextValue, ThemeMode } from "../types";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
  followSystemTheme?: boolean;
}

export function ThemeProvider({ children, defaultMode = "light", followSystemTheme = true }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (followSystemTheme && systemColorScheme) {
      return systemColorScheme;
    }
    return defaultMode;
  });

  // Update mode when system theme changes if following system
  useEffect(() => {
    if (followSystemTheme && systemColorScheme) {
      setMode(systemColorScheme);
    }
  }, [followSystemTheme, systemColorScheme]);

  // Listen for system appearance changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (followSystemTheme && colorScheme) {
        setMode(colorScheme);
      }
    });

    return () => subscription?.remove();
  }, [followSystemTheme]);

  const theme = useMemo<Theme>(() => {
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
  }, [mode]);

  const handleSetMode = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
  }, []);

  const handleToggleMode = useCallback(() => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const handleResetMode = useCallback(() => {
    const resetMode = followSystemTheme && systemColorScheme ? systemColorScheme : defaultMode;
    setMode(resetMode);
  }, [defaultMode, followSystemTheme, systemColorScheme]);

  const value: ThemeContextValue = useMemo(
    () => ({
      theme,
      mode,
      isDark: mode === "dark",
      setMode: handleSetMode,
      toggleMode: handleToggleMode,
      resetMode: handleResetMode,
    }),
    [theme, mode, handleSetMode, handleToggleMode, handleResetMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Separate hooks for specific theme aspects
export function useThemeColors() {
  const { theme } = useTheme();
  return theme.colors;
}

export function useThemeTypography() {
  const { theme } = useTheme();
  return theme.typography;
}

export function useThemeSpacing() {
  const { theme } = useTheme();
  return theme.spacing;
}

export function useThemeBorderRadius() {
  const { theme } = useTheme();
  return theme.borderRadius;
}

export function useThemeShadows() {
  const { theme } = useTheme();
  return theme.shadows;
}

export function useThemeOpacity() {
  const { theme } = useTheme();
  return theme.opacity;
}
