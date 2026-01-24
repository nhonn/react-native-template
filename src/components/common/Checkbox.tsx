import { cva, type VariantProps } from "class-variance-authority";
import { Check } from "lucide-react-native";
import { forwardRef, memo } from "react";
import { Pressable, View, type ViewProps } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Colors } from "@/theme/constants/colors";
import { cn } from "@/utils/classname";
import { Typography } from "./Typography";

const checkboxVariants = cva("justify-center", {
  variants: {
    size: {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    },
    variant: {
      default: "border-2 border-border",
      primary: "",
      square: "rounded-md",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

export interface CheckboxProps extends Omit<ViewProps, "onValueChange">, VariantProps<typeof checkboxVariants> {
  checked: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  className?: string;
  iconClassName?: string;
  label?: string;
}

const Checkbox = memo(
  forwardRef<View, CheckboxProps>(
    (
      {
        checked,
        onValueChange,
        disabled = false,
        indeterminate = false,
        size = "md",
        variant = "default",
        className,
        iconClassName,
        label,
        ...props
      },
      ref,
    ) => {
      const scale = useSharedValue(1);
      const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
      }));

      const handlePress = () => {
        if (!disabled) {
          scale.value = withTiming(0.9, { duration: 100 });
          setTimeout(() => {
            scale.value = withTiming(1, { duration: 100 });
          }, 100);
          onValueChange(!checked);
        }
      };

      let iconSize = 12;
      if (size === "md") {
        iconSize = 16;
      } else if (size === "lg") {
        iconSize = 20;
      }

      const checkboxContent = (
        <View className={cn(checkboxVariants({ size, variant }), className)} ref={ref} {...props}>
          <Animated.View
            className={cn("absolute inset-0 items-center justify-center rounded", {
              "bg-interactive-primary": checked || indeterminate,
              "bg-transparent": !(checked || indeterminate),
            })}
            style={animatedStyle}
          >
            {checked && !indeterminate && <Check color={Colors.white} size={iconSize} strokeWidth={3} />}
            {indeterminate && (
              <View
                className="bg-white"
                style={{
                  width: iconSize * 0.6,
                  height: 2,
                }}
              />
            )}
          </Animated.View>
        </View>
      );

      if (label) {
        return (
          <Pressable
            accessibilityLabel={label}
            accessibilityRole="checkbox"
            accessibilityState={{ checked, disabled }}
            className="flex-row items-center gap-2 active:opacity-70"
            disabled={disabled}
            onPress={handlePress}
          >
            {checkboxContent}
            <Typography className={disabled ? "text-text-disabled" : ""} variant="body">
              {label}
            </Typography>
          </Pressable>
        );
      }

      return (
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked, disabled }}
          className="active:opacity-70"
          disabled={disabled}
          onPress={handlePress}
        >
          {checkboxContent}
        </Pressable>
      );
    },
  ),
);

Checkbox.displayName = "Checkbox";

export { Checkbox, checkboxVariants };
