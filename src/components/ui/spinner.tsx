import { memo } from "react";
import { ActivityIndicator, type ActivityIndicatorProps, View } from "react-native";

import { useThemeColors } from "@/theme/hooks/useTheme";
import { cn } from "@/utils/classname";

const SIZE_MAP = {
  sm: 16,
  md: 24,
  lg: 32,
} as const;

export type SpinnerSize = keyof typeof SIZE_MAP;

export type SpinnerProps = Omit<ActivityIndicatorProps, "size"> & {
  className?: string;
  size?: SpinnerSize;
};

export const Spinner = memo(function Spinner({ className, size = "md", color, ...props }: SpinnerProps) {
  const colors = useThemeColors();

  return (
    <View className={cn("items-center justify-center", className)}>
      <ActivityIndicator color={color ?? colors.interactive.primary} size={SIZE_MAP[size]} {...props} />
    </View>
  );
});
