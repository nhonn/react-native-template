/**
 * Theme System Types
 * Type definitions for the design system
 */

import type { BorderRadius } from "../constants/borderRadius";
import type { Opacity } from "../constants/opacity";
import type { Shadows } from "../constants/shadows";
import type { Spacing } from "../constants/spacing";
import type { Typography } from "../constants/typography";

// Base theme mode
export type ThemeMode = "light" | "dark";

// Re-export typography types for convenience
export type { DeviceType, FontSize } from "../constants/typography";

// Text size preference for accessibility
export type TextSizePreference = "smaller" | "default" | "bigger";

// Color scheme interface
export interface ColorScheme {
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  surface: {
    primary: string;
    secondary: string;
    tertiary: string;
    elevated: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    disabled: string;
    placeholder: string;
  };
  border: {
    primary: string;
    secondary: string;
    focus: string;
    error: string;
    success: string;
    warning: string;
  };
  interactive: {
    primary: string;
    primaryHover: string;
    primaryPressed: string;
    secondary: string;
    secondaryHover: string;
    secondaryPressed: string;
    disabled: string;
  };
  semantic: {
    success: string;
    successBackground: string;
    successBorder: string;
    error: string;
    errorBackground: string;
    errorBorder: string;
    warning: string;
    warningBackground: string;
    warningBorder: string;
    info: string;
    infoBackground: string;
    infoBorder: string;
  };
  status: {
    online: string;
    offline: string;
    away: string;
    busy: string;
  };
}

// Complete theme interface
export interface Theme {
  mode: ThemeMode;
  colors: ColorScheme;
  typography: typeof Typography;
  spacing: typeof Spacing;
  borderRadius: typeof BorderRadius;
  shadows: typeof Shadows;
  opacity: typeof Opacity;
}

// Theme configuration options
export interface ThemeConfig {
  defaultMode?: ThemeMode;
  followSystemTheme?: boolean;
  persistTheme?: boolean;
}

// Theme context value
export interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  resetMode: () => void;
}
