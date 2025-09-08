/**
 * Design System Tokens
 * Comprehensive theme tokens supporting light/dark modes
 */

export type ThemeMode = "light" | "dark";

// Base color palette
const palette = {
  // Neutral colors
  white: "#ffffff",
  black: "#000000",
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    950: "#030712",
  },
  // Brand colors
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554",
  },
  // Semantic colors
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    950: "#052e16",
  },
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
    950: "#450a0a",
  },
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
    950: "#451a03",
  },
  info: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
    950: "#082f49",
  },
} as const;

// Typography scale
export const typography = {
  fontFamily: {
    sans: "System",
    mono: "Menlo",
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
    "5xl": 48,
    "6xl": 60,
  },
  fontWeight: {
    thin: "100",
    extralight: "200",
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tighter: -0.05,
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
  },
} as const;

// Spacing scale
export const spacing = {
  0: 0,
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
} as const;

// Border radius scale
export const borderRadius = {
  none: 0,
  sm: 2,
  base: 4,
  md: 6,
  lg: 8,
  xl: 12,
  "2xl": 16,
  "3xl": 24,
  full: 9999,
} as const;

// Shadow definitions
export const shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
  },
  xl: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 5,
  },
  "2xl": {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 6,
  },
} as const;

// Icon sizes
export const iconSizes = {
  xs: 12,
  sm: 16,
  base: 20,
  md: 24,
  lg: 28,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
} as const;

// Opacity scale
export const opacity = {
  0: 0,
  5: 0.05,
  10: 0.1,
  20: 0.2,
  25: 0.25,
  30: 0.3,
  40: 0.4,
  50: 0.5,
  60: 0.6,
  70: 0.7,
  75: 0.75,
  80: 0.8,
  90: 0.9,
  95: 0.95,
  100: 1,
} as const;

// Theme-specific color tokens
const lightTheme = {
  colors: {
    // Background colors
    background: {
      primary: palette.white,
      secondary: palette.gray[50],
      tertiary: palette.gray[100],
      inverse: palette.gray[900],
    },
    // Surface colors
    surface: {
      primary: palette.white,
      secondary: palette.gray[50],
      tertiary: palette.gray[100],
      elevated: palette.white,
      overlay: `${palette.black}${Math.round(opacity[50] * 255)
        .toString(16)
        .padStart(2, "0")}`,
    },
    // Text colors
    text: {
      primary: palette.gray[900],
      secondary: palette.gray[700],
      tertiary: palette.gray[500],
      inverse: palette.white,
      disabled: palette.gray[400],
    },
    // Border colors
    border: {
      primary: palette.gray[200],
      secondary: palette.gray[300],
      focus: palette.primary[500],
      error: palette.error[500],
    },
    // Interactive colors
    interactive: {
      primary: palette.primary[500],
      primaryHover: palette.primary[600],
      primaryPressed: palette.primary[700],
      secondary: palette.gray[100],
      secondaryHover: palette.gray[200],
      secondaryPressed: palette.gray[300],
    },
    // Semantic colors
    semantic: {
      success: palette.success[500],
      successBackground: palette.success[50],
      error: palette.error[500],
      errorBackground: palette.error[50],
      warning: palette.warning[500],
      warningBackground: palette.warning[50],
      info: palette.info[500],
      infoBackground: palette.info[50],
    },
  },
} as const;

const darkTheme = {
  colors: {
    // Background colors
    background: {
      primary: palette.gray[950],
      secondary: palette.gray[900],
      tertiary: palette.gray[800],
      inverse: palette.gray[50],
    },
    // Surface colors
    surface: {
      primary: palette.gray[900],
      secondary: palette.gray[800],
      tertiary: palette.gray[700],
      elevated: palette.gray[800],
      overlay: `${palette.black}${Math.round(opacity[70] * 255)
        .toString(16)
        .padStart(2, "0")}`,
    },
    // Text colors
    text: {
      primary: palette.gray[50],
      secondary: palette.gray[300],
      tertiary: palette.gray[400],
      inverse: palette.gray[900],
      disabled: palette.gray[600],
    },
    // Border colors
    border: {
      primary: palette.gray[700],
      secondary: palette.gray[600],
      focus: palette.primary[400],
      error: palette.error[400],
    },
    // Interactive colors
    interactive: {
      primary: palette.primary[500],
      primaryHover: palette.primary[400],
      primaryPressed: palette.primary[300],
      secondary: palette.gray[800],
      secondaryHover: palette.gray[700],
      secondaryPressed: palette.gray[600],
    },
    // Semantic colors
    semantic: {
      success: palette.success[400],
      successBackground: palette.success[950],
      error: palette.error[400],
      errorBackground: palette.error[950],
      warning: palette.warning[400],
      warningBackground: palette.warning[950],
      info: palette.info[400],
      infoBackground: palette.info[950],
    },
  },
} as const;

// Theme definitions
export const themes = {
  light: {
    ...lightTheme,
    typography,
    spacing,
    borderRadius,
    shadows,
    iconSizes,
    opacity,
  },
  dark: {
    ...darkTheme,
    typography,
    spacing,
    borderRadius,
    shadows,
    iconSizes,
    opacity,
  },
} as const;

// Type definitions
export type Theme = typeof themes.light;
export type ThemeColors = Theme["colors"];
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Shadows = typeof shadows;
export type IconSizes = typeof iconSizes;
export type Opacity = typeof opacity;

// Export palette for direct access when needed
export { palette };
