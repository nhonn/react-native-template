import { useColorScheme } from "nativewind";
import { useEffect } from "react";

import { useThemeStore } from "@/stores/theme";
import { useThemeContext } from "@/theme/ThemeProvider";

/**
 * Hook for theme management with NativeWind integration
 * Use this for basic theme switching functionality
 */
export function useTheme() {
  const { theme, systemTheme, useSystemTheme, toggleTheme, setTheme, setUseSystemTheme, getEffectiveTheme } =
    useThemeStore();
  const { setColorScheme } = useColorScheme();

  const effectiveTheme = getEffectiveTheme();

  // Sync with NativeWind
  useEffect(() => {
    setColorScheme(effectiveTheme);
  }, [effectiveTheme, setColorScheme]);

  return {
    theme: effectiveTheme,
    userTheme: theme,
    systemTheme,
    useSystemTheme,
    isDark: effectiveTheme === "dark",
    toggleTheme,
    setTheme,
    setUseSystemTheme,
  };
}

/**
 * Hook for accessing theme tokens and design system
 * Use this when you need access to colors, spacing, typography, etc.
 */
export function useDesignSystem() {
  return useThemeContext();
}
