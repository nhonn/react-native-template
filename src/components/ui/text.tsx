import { memo } from "react";
import { Text as RNText, type TextProps as RNTextProps } from "react-native";

import { TYPOGRAPHY_PRESETS } from "@/theme/constants/typography";
import { useResponsiveTypography } from "@/theme/hooks/useResponsiveTypography";
import { cn } from "@/utils/classname";

export type TextVariant = keyof typeof TYPOGRAPHY_PRESETS;

export type TextProps = RNTextProps & {
  className?: string;
  variant?: TextVariant;
};

export const Text = memo(function Text({ className, variant = "body", children, ...props }: TextProps) {
  const { getTypographyPreset } = useResponsiveTypography();

  return (
    <RNText className={cn(getTypographyPreset(variant), className)} {...props}>
      {children}
    </RNText>
  );
});
