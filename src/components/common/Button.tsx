import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, memo, useMemo } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useThemeColors } from "@/theme";
import { cn } from "@/utils/classname";

const buttonVariants = cva("items-center justify-center font-medium transition-colors", {
  variants: {
    variant: {
      primary: "bg-primary",
      secondary: "border border-border bg-secondary",
      ghost: "bg-transparent",
      danger: "bg-destructive",
    },
    size: {
      sm: "rounded-md px-3 py-2 text-sm",
      default: "rounded-lg px-4 py-3 text-base",
      lg: "rounded-lg px-6 py-4 text-lg",
    },
    fullWidth: {
      true: "w-full",
      false: "",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
    fullWidth: false,
  },
});

const buttonTextVariants = cva("font-semibold", {
  variants: {
    variant: {
      primary: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      ghost: "text-foreground",
      danger: "text-destructive-foreground",
    },
  },
});

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof Pressable>,
    VariantProps<typeof buttonVariants> {
  title: string;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}
const Button = memo(
  forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
    (
      {
        className,
        variant,
        size,
        fullWidth,
        title,
        loading = false,
        leftIcon,
        rightIcon,
        disabled,
        accessibilityLabel,
        accessibilityHint,
        ...props
      },
      ref,
    ) => {
      const buttonClasses = useMemo(() => {
        return cn(
          buttonVariants({ variant, size, fullWidth, className }),
          disabled && "opacity-60 dark:opacity-50",
          loading && "opacity-80",
        );
      }, [variant, size, fullWidth, className, disabled, loading]);

      const buttonTextClasses = useMemo(() => {
        return buttonTextVariants({ variant });
      }, [variant]);

      const colors = useThemeColors();

      const loadingIndicator = useMemo(
        () => <ActivityIndicator className="mr-2" color={colors.text.primary} size="small" />,
        [colors.text.primary],
      );

      return (
        <Pressable
          accessibilityHint={accessibilityHint}
          accessibilityLabel={accessibilityLabel || title}
          accessibilityRole="button"
          accessible={true}
          className={buttonClasses}
          disabled={disabled || loading}
          ref={ref}
          {...props}
        >
          <View className="flex-row items-center justify-center">
            {loading ? loadingIndicator : leftIcon && <View className="mr-2">{leftIcon}</View>}
            <Text className={buttonTextClasses}>{title}</Text>
            {rightIcon && !loading && <View className="ml-2">{rightIcon}</View>}
          </View>
        </Pressable>
      );
    },
  ),
);

Button.displayName = "Button";

export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

export { Button, buttonVariants };
