/**
 * Unistyles Registry
 * Registers the app's light/dark themes with react-native-unistyles and
 * bridges mode changes from the Legend State theme store to UnistylesRuntime.
 */

import { Appearance } from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";

import { BorderRadius } from "./constants/borderRadius";
import { Opacity } from "./constants/opacity";
import { Shadows } from "./constants/shadows";
import { Spacing } from "./constants/spacing";
import { Typography } from "./constants/typography";
import { darkColorScheme } from "./themes/dark";
import { lightColorScheme } from "./themes/light";
import type { ColorScheme, Theme, ThemeMode } from "./types";

export const createTheme = (mode: ThemeMode): Theme => {
  const colorScheme: ColorScheme = mode === "dark" ? darkColorScheme : lightColorScheme;

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

const unistyleThemes = {
  light: createTheme("light"),
  dark: createTheme("dark"),
};

type UnistylesThemeName = keyof typeof unistyleThemes;

type AppThemes = typeof unistyleThemes;

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
}

// Follows the system on first launch, matching the theme store default
// (followSystemTheme: true). The store re-syncs the resolved persisted mode
// during app init via initializeUnistylesTheme().
StyleSheet.configure({
  themes: unistyleThemes,
  settings: {
    initialTheme: () => (Appearance.getColorScheme() === "dark" ? "dark" : "light"),
  },
});

/**
 * Applies a resolved theme mode to unistyles. Called by the theme store on
 * every mode change; unistyles updates all themed stylesheets without
 * React re-renders. No-op when the theme is already active.
 */
export function applyUnistylesTheme(mode: ThemeMode): void {
  const name: UnistylesThemeName = mode === "dark" ? "dark" : "light";
  if (UnistylesRuntime.themeName !== name) {
    UnistylesRuntime.setTheme(name);
  }
}
