import { DarkTheme, DefaultTheme, type Theme as NavigationTheme } from "@react-navigation/native";

import type { Theme } from "@/theme";

/**
 * Maps the template's design tokens onto React Navigation's theme so
 * navigators (headers, backgrounds, tab bars) follow the theme store.
 */
export const createNavigationTheme = (theme: Theme): NavigationTheme => {
  const base = theme.mode === "dark" ? DarkTheme : DefaultTheme;

  return {
    ...base,
    dark: theme.mode === "dark",
    colors: {
      ...base.colors,
      primary: theme.colors.interactive.primary,
      background: theme.colors.background.primary,
      card: theme.colors.surface.primary,
      text: theme.colors.text.primary,
      border: theme.colors.border.primary,
      notification: theme.colors.semantic.info,
    },
  };
};
