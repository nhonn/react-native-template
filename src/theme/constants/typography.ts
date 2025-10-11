/**
 * Typography Constants
 * Font sizes, weights, line heights, and letter spacing for responsive typography system
 */

// Base font sizes in logical pixels (dp/pt) for responsive typography
export const BASE_FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
  "5xl": 48,
  "6xl": 60,
} as const;

// Line height multipliers for optimal vertical rhythm
export const LINE_HEIGHT_MULTIPLIERS = {
  xs: 1.4,
  sm: 1.43,
  md: 1.5,
  lg: 1.44,
  xl: 1.4,
  "2xl": 1.33,
  "3xl": 1.2,
  "4xl": 1.11,
  "5xl": 1.04,
  "6xl": 1.0,
} as const;

// Device breakpoints based on smallest dimension
export const BREAKPOINTS = {
  phone: 0,
  tablet: 768,
  desktop: 1024,
} as const;

// Typography presets for common use cases with proper contrast and accessibility
export const TYPOGRAPHY_PRESETS = {
  // Headers - High contrast for readability
  h1: {
    size: "4xl" as FontSize,
    weight: "font-bold",
    contrast: "text-text-light dark:text-text-dark",
  },
  h2: {
    size: "3xl" as FontSize,
    weight: "font-bold",
    contrast: "text-text-light dark:text-text-dark",
  },
  h3: {
    size: "2xl" as FontSize,
    weight: "font-semibold",
    contrast: "text-text-light dark:text-text-dark",
  },
  h4: {
    size: "xl" as FontSize,
    weight: "font-semibold",
    contrast: "text-text-light dark:text-text-dark",
  },
  h5: {
    size: "lg" as FontSize,
    weight: "font-medium",
    contrast: "text-text-light dark:text-text-dark",
  },
  h6: {
    size: "md" as FontSize,
    weight: "font-medium",
    contrast: "text-text-light dark:text-text-dark",
  },

  // Body text - Standard contrast for comfortable reading
  body: {
    size: "md" as FontSize,
    weight: "font-normal",
    contrast: "text-text-light dark:text-text-dark",
  },
  bodyLarge: {
    size: "lg" as FontSize,
    weight: "font-normal",
    contrast: "text-text-light dark:text-text-dark",
  },
  bodySmall: {
    size: "sm" as FontSize,
    weight: "font-normal",
    contrast: "text-text-light/80 dark:text-text-dark/80",
  },

  // UI elements - Optimized for interactive elements
  button: {
    size: "md" as FontSize,
    weight: "font-medium",
    contrast: "text-white dark:text-text-dark",
  },
  caption: {
    size: "xs" as FontSize,
    weight: "font-normal",
    contrast: "text-text-light/70 dark:text-text-dark/70",
  },
  label: {
    size: "sm" as FontSize,
    weight: "font-medium",
    contrast: "text-text-light/80 dark:text-text-dark/80",
  },
  // Error states - High contrast for accessibility
  error: {
    size: "sm" as FontSize,
    weight: "font-medium",
    contrast: "text-error dark:text-error-light",
  },
  // Success states - High contrast for accessibility
  success: {
    size: "sm" as FontSize,
    weight: "font-medium",
    contrast: "text-success dark:text-success",
  },
} as const;

export const Typography = {
  // Font families
  fontFamily: {
    primary: "System",
    secondary: "System",
    monospace: "Menlo",
  },

  // Font sizes (px) - Legacy support, use BASE_FONT_SIZES for responsive typography
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
    "7xl": 72,
    "8xl": 96,
    "9xl": 128,
  },

  // Font weights
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

  // Line heights
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tighter: -0.05,
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
  },
} as const;

export type FontFamily = keyof typeof Typography.fontFamily;
export type FontSize = keyof typeof BASE_FONT_SIZES;
export type FontWeight = keyof typeof Typography.fontWeight;
export type LineHeight = keyof typeof Typography.lineHeight;
export type LetterSpacing = keyof typeof Typography.letterSpacing;
export type DeviceType = keyof typeof BREAKPOINTS;
