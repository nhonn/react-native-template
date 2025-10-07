import { useCallback } from "react";
import { Dimensions, PixelRatio } from "react-native";

import { type TextSizePreference, useSettingsStore } from "@/stores/settings";

/**
 * Typography utility for responsive text sizing based on device density and screen dimensions
 * Implements industry best practices for React Native typography
 */

// Base font sizes in logical pixels (dp/pt)
const BASE_FONT_SIZES = {
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
const LINE_HEIGHT_MULTIPLIERS = {
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
const BREAKPOINTS = {
  phone: 0,
  tablet: 768,
  desktop: 1024,
} as const;

type FontSize = keyof typeof BASE_FONT_SIZES;
type DeviceType = keyof typeof BREAKPOINTS;

const FONT_SIZE_ORDER = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
] as const satisfies readonly FontSize[];

const TEXT_SIZE_ADJUSTMENTS: Record<TextSizePreference, -1 | 0 | 1> = {
  smaller: -1,
  default: 0,
  bigger: 1,
};

const shiftFontSize = (size: FontSize, shift: number): FontSize => {
  const currentIndex = FONT_SIZE_ORDER.indexOf(size);
  if (currentIndex === -1) {
    return size;
  }

  const nextIndex = Math.min(Math.max(currentIndex + shift, 0), FONT_SIZE_ORDER.length - 1);
  return FONT_SIZE_ORDER[nextIndex];
};

const applyTextSizePreference = (size: FontSize, preference: TextSizePreference): FontSize => {
  const adjustment = TEXT_SIZE_ADJUSTMENTS[preference] ?? 0;
  return shiftFontSize(size, adjustment);
};

export const getTypographyStyleForPreference = (size: FontSize, preference: TextSizePreference) => {
  const adjustedSize = applyTextSizePreference(size, preference);
  return getTypographyStyle(adjustedSize);
};

/**
 * Get device type based on screen dimensions
 */
export const getDeviceType = (): DeviceType => {
  const { width, height } = Dimensions.get("window");
  const minDimension = Math.min(width, height);

  if (minDimension >= BREAKPOINTS.desktop) {
    return "desktop";
  }
  if (minDimension >= BREAKPOINTS.tablet) {
    return "tablet";
  }
  return "phone";
};

/**
 * Calculate density-aware font size
 * Uses a combination of pixel ratio and screen dimensions for optimal scaling
 */
export const getDensityAwareFontSize = (baseFontSize: number): number => {
  const pixelRatio = PixelRatio.get();
  const { width, height } = Dimensions.get("window");
  const screenArea = width * height;

  // Base scaling factor based on pixel density
  let densityScale = 1;

  // Adjust for different pixel densities
  if (pixelRatio <= 1) {
    // Low density (mdpi)
    densityScale = 1.1;
  } else if (pixelRatio <= 1.5) {
    // Medium density (hdpi)
    densityScale = 1.05;
  } else if (pixelRatio <= 2) {
    // High density (xhdpi)
    densityScale = 1.0;
  } else if (pixelRatio <= 3) {
    // Extra high density (xxhdpi)
    densityScale = 0.98;
  } else {
    // Ultra high density (xxxhdpi)
    densityScale = 0.95;
  }

  // Additional scaling based on screen size
  const deviceType = getDeviceType();
  let deviceScale = 1;

  switch (deviceType) {
    case "phone":
      // Smaller screens need slightly larger text for readability
      deviceScale = screenArea < 300_000 ? 1.1 : 1.0;
      break;
    case "tablet":
      // Tablets can handle standard or slightly smaller text
      deviceScale = 1.0;
      break;
    case "desktop":
      // Large screens can use smaller relative text
      deviceScale = 0.95;
      break;
    default:
      // Default to phone scaling for unknown device types
      deviceScale = 1.0;
      break;
  }

  return Math.round(baseFontSize * densityScale * deviceScale);
};

/**
 * Get responsive font size with device-specific scaling
 */
export const getResponsiveFontSize = (size: FontSize): number => {
  const baseFontSize = BASE_FONT_SIZES[size];
  return getDensityAwareFontSize(baseFontSize);
};

/**
 * Get responsive line height maintaining vertical rhythm
 */
export const getResponsiveLineHeight = (size: FontSize): number => {
  const fontSize = getResponsiveFontSize(size);
  const multiplier = LINE_HEIGHT_MULTIPLIERS[size];
  return Math.round(fontSize * multiplier);
};

/**
 * Generate responsive typography styles for React Native Text components
 */
export const getTypographyStyle = (size: FontSize) => {
  const fontSize = getResponsiveFontSize(size);
  const lineHeight = getResponsiveLineHeight(size);

  return {
    fontSize,
    lineHeight,
  };
};

/**
 * Get responsive typography class names for NativeWind
 * Returns appropriate Tailwind classes based on device type and density
 */
export const getResponsiveTextClass = (size: FontSize): string => {
  const deviceType = getDeviceType();
  const pixelRatio = PixelRatio.get();

  // Base class
  let baseClass = `text-${size}`;

  // Adjust for device type and density
  if (deviceType === "tablet") {
    // Tablets can use larger text sizes
    const sizeMap: Record<FontSize, string> = {
      xs: "text-sm",
      sm: "text-md",
      md: "text-lg",
      lg: "text-xl",
      xl: "text-2xl",
      "2xl": "text-3xl",
      "3xl": "text-4xl",
      "4xl": "text-5xl",
      "5xl": "text-6xl",
      "6xl": "text-6xl",
    };
    baseClass = sizeMap[size];
  } else if (deviceType === "phone" && pixelRatio >= 3) {
    // High-density phones might need size adjustment
    const sizeMap: Record<FontSize, string> = {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-md",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
      "5xl": "text-5xl",
      "6xl": "text-6xl",
    };
    baseClass = sizeMap[size];
  }

  return baseClass;
};

/**
 * Typography presets for common use cases with proper contrast and accessibility
 * Following WCAG 2.1 AA guidelines for color contrast ratios
 */
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
    contrast: "text-text-light/80 dark:text-text-dark/80", // Improved contrast from 70% to 80%
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
    contrast: "text-text-light/70 dark:text-text-dark/70", // Minimum readable contrast
  },
  label: {
    size: "sm" as FontSize,
    weight: "font-medium",
    contrast: "text-text-light/80 dark:text-text-dark/80", // Improved contrast for labels
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

/**
 * Get complete typography class string for a preset
 */
export const getTypographyPreset = (preset: keyof typeof TYPOGRAPHY_PRESETS): string => {
  const config = TYPOGRAPHY_PRESETS[preset];
  const responsiveSize = getResponsiveTextClass(config.size);

  return `${responsiveSize} ${config.weight} ${config.contrast}`;
};

/**
 * Hook for responsive typography that updates on dimension changes
 */
export const useResponsiveTypography = () => {
  const deviceType = getDeviceType();
  const pixelRatio = PixelRatio.get();
  const textSizePreference = useSettingsStore((state: any) => state.textSizePreference);

  const getAdjustedFontSize = useCallback(
    (size: FontSize) => applyTextSizePreference(size, textSizePreference),
    [textSizePreference],
  );

  const getPreferredResponsiveFontSize = useCallback(
    (size: FontSize) => getResponsiveFontSize(getAdjustedFontSize(size)),
    [getAdjustedFontSize],
  );

  const getPreferredResponsiveLineHeight = useCallback(
    (size: FontSize) => getResponsiveLineHeight(getAdjustedFontSize(size)),
    [getAdjustedFontSize],
  );

  const getPreferredTypographyStyle = useCallback(
    (size: FontSize) => getTypographyStyle(getAdjustedFontSize(size)),
    [getAdjustedFontSize],
  );

  const getPreferredResponsiveTextClass = useCallback(
    (size: FontSize) => getResponsiveTextClass(getAdjustedFontSize(size)),
    [getAdjustedFontSize],
  );

  const getPreferredTypographyPreset = useCallback(
    (preset: keyof typeof TYPOGRAPHY_PRESETS) => {
      const config = TYPOGRAPHY_PRESETS[preset];
      const responsiveSize = getPreferredResponsiveTextClass(config.size);
      return `${responsiveSize} ${config.weight} ${config.contrast}`;
    },
    [getPreferredResponsiveTextClass],
  );

  return {
    deviceType,
    pixelRatio,
    getResponsiveFontSize: getPreferredResponsiveFontSize,
    getResponsiveLineHeight: getPreferredResponsiveLineHeight,
    getTypographyStyle: getPreferredTypographyStyle,
    getResponsiveTextClass: getPreferredResponsiveTextClass,
    getTypographyPreset: getPreferredTypographyPreset,
    textSizePreference,
  };
};
