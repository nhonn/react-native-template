import { type FC, memo, type ReactNode, useMemo } from "react";
import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from "react-native";

import { cn } from "@/utils/classname";
import { TYPOGRAPHY_PRESETS, useResponsiveTypography } from "@/utils/typography";

// Font size variants based on the typography system
type FontSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";

// Typography presets for semantic text styles
type TypographyPreset = keyof typeof TYPOGRAPHY_PRESETS;

// Regex for filtering out Tailwind font-size classes
const FONT_SIZE_CLASS_REGEX = /^text-(xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl)$/;

interface ResponsiveTextProps extends Omit<RNTextProps, "style"> {
  /**
   * Font size variant - automatically scales based on device DPI and screen density
   * @default "md"
   */
  size?: FontSize;

  /**
   * Typography preset for semantic styling (overrides size and weight)
   * Uses DPI-aware scaling for optimal readability
   */
  preset?: TypographyPreset;

  /**
   * Additional CSS classes (font-size classes will be filtered out in favor of calculated sizes)
   */
  className?: string;

  /**
   * Children content
   */
  children: ReactNode;

  /**
   * Whether text should be selectable
   * @default false
   */
  selectable?: boolean;

  /**
   * Additional inline styles (will be merged with DPI-aware typography styles)
   */
  style?: TextStyle;
}

/**
 * Filter out font-size related classes from NativeWind className
 * This ensures calculated DPI-aware font sizes take precedence
 */
const filterFontSizeClasses = (className: string): string => {
  if (!className) {
    return "";
  }

  // Remove Tailwind font-size classes (text-xs, text-sm, text-md, etc.)
  return className
    .split(" ")
    .filter((cls) => !cls.match(FONT_SIZE_CLASS_REGEX))
    .join(" ");
};

const RNResponsiveText: FC<ResponsiveTextProps> = ({
  size = "md",
  preset,
  className,
  children,
  selectable = false,
  style,
  accessibilityRole = "text",
  ...props
}) => {
  const { getTypographyPreset, getTypographyStyle, textSizePreference } = useResponsiveTypography();

  // Calculate DPI-aware typography styles
  const calculatedTypographyStyle = useMemo(() => {
    if (preset) {
      // Extract font size from preset and calculate DPI-aware size
      const presetConfig = TYPOGRAPHY_PRESETS[preset];
      return getTypographyStyle(presetConfig.size);
    }
    // Use individual size prop
    return getTypographyStyle(size);
  }, [preset, size, getTypographyStyle, textSizePreference]);

  // Filter out font-size classes and get styling classes
  const filteredClassName = useMemo(() => {
    if (preset) {
      // For presets, get the preset classes but filter out font-size classes
      const presetClasses = getTypographyPreset(preset);
      const filteredPresetClasses = filterFontSizeClasses(presetClasses);
      const additionalClasses = filterFontSizeClasses(className || "");
      return cn(filteredPresetClasses, additionalClasses);
    }

    // For individual props, filter font-size classes and add default text color
    const filteredClasses = filterFontSizeClasses(className || "");
    return cn("text-text-light dark:text-text-dark", filteredClasses);
  }, [preset, className, getTypographyPreset, textSizePreference]);

  // Combine calculated typography styles with user-provided styles
  const combinedStyle = useMemo(
    () => ({
      ...calculatedTypographyStyle,
      ...style,
    }),
    [style, calculatedTypographyStyle],
  );

  return (
    <RNText
      {...props}
      accessibilityRole={accessibilityRole}
      accessible={true}
      className={filteredClassName}
      selectable={selectable}
      style={combinedStyle}
    >
      {children}
    </RNText>
  );
};

export const ResponsiveText = memo(RNResponsiveText);
