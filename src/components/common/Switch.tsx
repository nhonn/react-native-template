import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, memo } from "react";
import { Pressable, View, type ViewProps } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useThemeColors } from "@/theme";
import { Colors } from "@/theme/constants/colors";
import { cn } from "@/utils/classname";

const switchVariants = cva("justify-center", {
  variants: {
    size: {
      sm: "h-5 w-8",
      md: "h-6 w-11",
      lg: "h-8 w-14",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const thumbVariants = cva("", {
  variants: {
    size: {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-7 w-7",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface SwitchProps extends Omit<ViewProps, "onValueChange">, VariantProps<typeof switchVariants> {
  checked: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
  thumbClassName?: string;
  trackClassName?: string;
}

const Switch = memo(
  forwardRef<View, SwitchProps>(
    (
      { checked, onValueChange, disabled = false, size = "md", className, thumbClassName, trackClassName, ...props },
      ref,
    ) => {
      const colors = useThemeColors();
      const progress = useSharedValue(checked ? 1 : 0);

      let translateAmount = 12;
      if (size === "md") {
        translateAmount = 20;
      } else if (size === "lg") {
        translateAmount = 24;
      }

      const animatedThumbStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: progress.value * translateAmount }],
      }));

      const animatedTrackStyle = useAnimatedStyle(() => {
        if (disabled) {
          return { backgroundColor: colors.text.disabled };
        }
        if (progress.value > 0.5) {
          return { backgroundColor: colors.interactive.primary };
        }
        return { backgroundColor: colors.border.primary };
      });

      const animatedThumbColorStyle = useAnimatedStyle(() => ({
        backgroundColor: progress.value > 0.5 ? Colors.white : colors.surface.primary,
      }));

      const handlePress = () => {
        if (!disabled) {
          progress.value = withTiming(checked ? 0 : 1, { duration: 200 });
          onValueChange(!checked);
        }
      };

      return (
        <Pressable
          accessibilityRole="switch"
          accessibilityState={{ checked, disabled }}
          className="active:opacity-80"
          disabled={disabled}
          onPress={handlePress}
        >
          <View className={cn(switchVariants({ size }), className)} ref={ref} {...props}>
            <Animated.View
              className={cn("absolute inset-0 rounded-full", trackClassName)}
              style={[animatedTrackStyle, { borderColor: colors.border.primary }]}
            />
            <Animated.View
              className={cn(
                thumbVariants({ size }),
                "absolute top-0.5 left-0.5 rounded-full shadow-sm",
                thumbClassName,
              )}
              style={animatedThumbColorStyle}
            />
            <Animated.View
              className={cn(
                thumbVariants({ size }),
                "absolute top-0.5 left-0.5 rounded-full shadow-sm",
                thumbClassName,
              )}
              style={animatedThumbStyle}
            />
          </View>
        </Pressable>
      );
    },
  ),
);

Switch.displayName = "Switch";

export { Switch, switchVariants, thumbVariants };
