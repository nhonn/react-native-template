import { useColorScheme } from "nativewind";
import { createContext, type ReactNode, useContext } from "react";

import { useThemeStore } from "@/stores/theme";
import { type Theme, type ThemeMode, themes } from "./tokens";

interface ThemeContextValue {
  theme: typeof themes.light;
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme: mode, toggleTheme } = useThemeStore();
  const { colorScheme } = useColorScheme();

  const theme = themes[mode] as Theme;
  const isDark = colorScheme === "dark";

  const value: ThemeContextValue = {
    theme,
    mode,
    isDark,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}

// Convenience hooks for accessing specific parts of the theme
export function useThemeColors() {
  const { theme } = useThemeContext();
  return theme.colors;
}

export function useThemeTypography() {
  const { theme } = useThemeContext();
  return theme.typography;
}

export function useThemeSpacing() {
  const { theme } = useThemeContext();
  return theme.spacing;
}

export function useThemeBorderRadius() {
  const { theme } = useThemeContext();
  return theme.borderRadius;
}

export function useThemeShadows() {
  const { theme } = useThemeContext();
  return theme.shadows;
}

export function useThemeIconSizes() {
  const { theme } = useThemeContext();
  return theme.iconSizes;
}

export function useThemeOpacity() {
  const { theme } = useThemeContext();
  return theme.opacity;
}
