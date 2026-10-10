import { DarkTheme, DefaultTheme, type Theme as NavigationTheme } from "expo-router";

import type { Theme } from "./types";

/**
 * Maps the template's design tokens onto expo-router's navigation theme so
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
