import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, memo, useMemo } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { cn } from "@/utils/classname";

const buttonVariants = cva("items-center justify-center rounded-2xl font-medium transition-colors", {
  variants: {
    variant: {
      primary: "bg-theme",
      secondary: "bg-secondary",
      outline: "border",
      ghost: "bg-transparent",
      destructive: "bg-red-500",
      success: "bg-green-500",
      warning: "bg-orange-500",
      info: "bg-emerald-500",
      link: "bg-transparent underline",
    },
    size: {
      xs: "px-2 py-1 text-xs",
      sm: "px-3 py-2 text-sm",
      default: "px-4 py-3 text-base",
      lg: "px-6 py-4 text-lg",
      xl: "px-8 py-5 text-xl",
    },
    fullWidth: {
      true: "w-full",
      false: "",
    },
    rounded: {
      none: "rounded-none",
      sm: "rounded",
      default: "rounded-2xl",
      full: "rounded-full",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
    fullWidth: false,
    rounded: "default",
  },
});

const buttonTextVariants = cva("font-bold", {
  variants: {
    variant: {
      primary: "text-text-dark",
      secondary: "text-text-light dark:text-text-dark",
      outline: "text-text-light dark:text-text-dark",
      ghost: "text-text-light dark:text-text-dark",
      destructive: "text-text-dark",
      success: "text-text-dark",
      warning: "text-text-dark",
      info: "text-text-dark",
      link: "text-text-dark",
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
        rounded,
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
          buttonVariants({ variant, size, fullWidth, rounded, className }),
          disabled && "opacity-60 dark:opacity-50",
          loading && "opacity-80",
        );
      }, [variant, size, fullWidth, rounded, className, disabled, loading]);

      const buttonTextClasses = useMemo(() => {
        return buttonTextVariants({ variant });
      }, [variant]);

      const loadingIndicator = useMemo(() => <ActivityIndicator className="mr-2" color="#3b82f6" size="small" />, []);

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
export type ButtonRounded = VariantProps<typeof buttonVariants>["rounded"];

export { Button, buttonVariants };
