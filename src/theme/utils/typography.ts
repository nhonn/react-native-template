import { Dimensions, PixelRatio } from "react-native";

import type { DeviceType, FontSize } from "../constants/typography";
import { BASE_FONT_SIZES, BREAKPOINTS, LINE_HEIGHT_MULTIPLIERS, TYPOGRAPHY_PRESETS } from "../constants/typography";

/**
 * Typography utility functions for responsive text sizing based on device density and screen dimensions
 * Implements industry best practices for React Native typography
 */

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
 * Get complete typography class string for a preset
 */
export const getTypographyPreset = (preset: keyof typeof TYPOGRAPHY_PRESETS): string => {
  const config = TYPOGRAPHY_PRESETS[preset];
  const responsiveSize = getResponsiveTextClass(config.size);

  return `${responsiveSize} ${config.weight} ${config.contrast}`;
};
