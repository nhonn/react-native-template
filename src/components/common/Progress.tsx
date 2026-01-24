import { cva, type VariantProps } from "class-variance-authority";
import { memo, useMemo } from "react";
import { View, type ViewProps } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";

import { useThemeColors } from "@/theme";
import { cn } from "@/utils/classname";
import { Typography } from "./Typography";

const progressVariants = cva("", {
  variants: {
    size: {
      sm: "h-1",
      md: "h-2",
      lg: "h-3",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface ProgressBarProps extends ViewProps, VariantProps<typeof progressVariants> {
  value: number;
  max?: number;
  variant?: "default" | "success" | "warning" | "error";
  showLabel?: boolean;
  className?: string;
  barClassName?: string;
}

const ProgressBar = memo<ProgressBarProps>(
  ({ value, max = 100, variant = "default", size = "md", showLabel = false, className, barClassName, ...props }) => {
    const themeColors = useThemeColors();
    const progress = useMemo(() => Math.min(Math.max(0, (value / max) * 100), 100), [value, max]);

    const progressColor = useMemo(() => {
      switch (variant) {
        case "success":
          return themeColors.semantic.success;
        case "warning":
          return themeColors.semantic.warning;
        case "error":
          return themeColors.semantic.error;
        default:
          return themeColors.interactive.primary;
      }
    }, [variant, themeColors]);

    const animatedWidth = useSharedValue(progress);

    const animatedStyle = useAnimatedStyle(() => ({
      width: `${animatedWidth.value}%`,
    }));

    return (
      <View className={cn("w-full", className)} {...props}>
        <View className={cn("w-full overflow-hidden rounded-full bg-surface-secondary", progressVariants({ size }))}>
          <Animated.View
            className={cn("h-full rounded-full", barClassName)}
            style={[{ backgroundColor: progressColor }, animatedStyle]}
          />
        </View>
        {showLabel && (
          <Typography className="mt-1 text-right text-text-secondary" variant="caption">
            {progress}%
          </Typography>
        )}
      </View>
    );
  },
);

ProgressBar.displayName = "ProgressBar";

export { ProgressBar, progressVariants };

export const CircularProgress = memo<{
  size?: number;
  strokeWidth?: number;
  value: number;
  max?: number;
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
  showLabel?: boolean;
}>(({ size = 40, strokeWidth = 4, value, max = 100, variant = "default", className, showLabel = false }) => {
  const themeColors = useThemeColors();
  const progress = useMemo(() => Math.min(Math.max(0, (value / max) * 100), 100), [value, max]);

  const progressColor = useMemo(() => {
    switch (variant) {
      case "success":
        return themeColors.semantic.success;
      case "warning":
        return themeColors.semantic.warning;
      case "error":
        return themeColors.semantic.error;
      default:
        return themeColors.interactive.primary;
    }
  }, [variant, themeColors]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View className={cn("items-center justify-center", className)}>
      <View style={{ width: size, height: size }}>
        <svg height={size} width={size}>
          <title>Progress: {progress}%</title>
          <circle
            cx={size / 2}
            cy={size / 2}
            fill="transparent"
            r={radius}
            stroke={themeColors.surface.secondary}
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            fill="transparent"
            r={radius}
            stroke={progressColor}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            strokeWidth={strokeWidth}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
      </View>
      {showLabel && (
        <View className="absolute" style={{ top: size / 2, marginTop: -8 }}>
          <Typography className="text-text-secondary" variant="caption">
            {progress}%
          </Typography>
        </View>
      )}
    </View>
  );
});

CircularProgress.displayName = "CircularProgress";
