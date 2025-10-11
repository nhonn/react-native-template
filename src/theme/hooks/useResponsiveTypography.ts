import { useCallback } from "react";
import { PixelRatio } from "react-native";

import { useSettingsStore } from "@/stores/settings";

import { TYPOGRAPHY_PRESETS } from "../constants/typography";
import type { FontSize, TextSizePreference } from "../types";
import {
  getDeviceType,
  getResponsiveFontSize,
  getResponsiveLineHeight,
  getResponsiveTextClass,
  getTypographyStyle,
} from "../utils/typography";

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
