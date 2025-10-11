/**
 * Theme System
 * Comprehensive design system for React Native applications
 */

export { BorderRadius } from "./constants/borderRadius";
export { Breakpoints } from "./constants/breakpoints";
// Constants
export { Colors } from "./constants/colors";
export { Opacity } from "./constants/opacity";
export { Shadows } from "./constants/shadows";
export { Spacing } from "./constants/spacing";
export {
  BASE_FONT_SIZES,
  BREAKPOINTS,
  LINE_HEIGHT_MULTIPLIERS,
  TYPOGRAPHY_PRESETS,
  Typography,
} from "./constants/typography";
// Typography hooks
export {
  getTypographyStyleForPreference,
  useResponsiveTypography,
} from "./hooks/useResponsiveTypography";
export {
  useIsDarkTheme,
  useTheme,
  useThemeBorderRadius,
  useThemeColors,
  useThemeConfig,
  useThemeMode,
  useThemeOpacity,
  useThemeShadows,
  useThemeSpacing,
  useThemeTypography,
} from "./hooks/useTheme";
// Hooks
export { useThemedStyle, useThemedValue } from "./hooks/useThemedStyle";
// Store and Hooks (Zustand)
export { useSystemThemeTracking, useThemeStore } from "./stores/useThemeStore";
export { darkColorScheme } from "./themes/dark";
// Themes
export { lightColorScheme } from "./themes/light";
// Types
export type {
  ColorScheme,
  DeviceType,
  FontSize,
  TextSizePreference,
  Theme,
  ThemeConfig,
  ThemeContextValue,
  ThemeMode,
} from "./types";
// Utilities
export {
  createColorClasses,
  createSpacingClasses,
  createTypographyClasses,
  createUtilityClasses,
} from "./utils/createThemeClasses";
// Typography utilities
export {
  getDensityAwareFontSize,
  getDeviceType,
  getResponsiveFontSize,
  getResponsiveLineHeight,
  getResponsiveTextClass,
  getTypographyPreset,
  getTypographyStyle,
} from "./utils/typography";
