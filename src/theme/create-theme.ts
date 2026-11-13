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
