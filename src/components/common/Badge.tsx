import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, memo } from "react";
import { Pressable, View, type ViewProps } from "react-native";

import { cn } from "@/utils/classname";

const badgeVariants = cva("items-center justify-center", {
  variants: {
    variant: {
      default: "border border-border bg-surface-secondary",
      primary: "bg-interactive-primary",
      secondary: "bg-interactive-secondary",
      success: "bg-semantic-success",
      error: "bg-semantic-error",
      warning: "bg-semantic-warning",
      info: "bg-interactive-primary",
    },
    size: {
      sm: "rounded-md px-2 py-0.5 text-xs",
      md: "rounded-md px-2.5 py-1 text-sm",
      lg: "rounded-lg px-3 py-1.5 text-base",
    },
    shape: {
      rounded: "rounded-md",
      full: "rounded-full",
      square: "rounded-none",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    shape: "rounded",
  },
});

const chipVariants = cva("flex-row items-center gap-1.5", {
  variants: {
    variant: {
      default: "border border-border bg-surface-secondary",
      primary: "bg-interactive-primary",
      secondary: "bg-interactive-secondary",
      success: "bg-semantic-success",
      error: "bg-semantic-error",
      warning: "bg-semantic-warning",
      info: "bg-interactive-primary",
    },
    size: {
      sm: "rounded-full px-2 py-1 text-xs",
      md: "rounded-full px-2.5 py-1.5 text-sm",
      lg: "rounded-full px-3 py-2 text-base",
    },
    selected: {
      true: "ring-2 ring-border-primary",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    selected: false,
  },
});

export interface BadgeProps extends ViewProps, VariantProps<typeof badgeVariants> {
  className?: string;
  children: React.ReactNode;
}

export interface ChipProps extends ViewProps, VariantProps<typeof chipVariants> {
  className?: string;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

const Badge = memo<BadgeProps>(
  forwardRef<View, BadgeProps>(({ className, variant, size, shape, children, ...props }, ref) => {
    return (
      <View className={cn(badgeVariants({ variant, size, shape }), "inline-block", className)} ref={ref} {...props}>
        {children}
      </View>
    );
  }),
);

const Chip = memo<ChipProps>(
  forwardRef<View, ChipProps>(
    (
      { className, variant, size, selected, leftIcon, rightIcon, onPress, disabled = false, children, ...props },
      ref,
    ) => {
      const chipContent = (
        <View className={cn(chipVariants({ variant, size, selected }), className)} ref={ref} {...props}>
          {leftIcon && <View className="shrink-0">{leftIcon}</View>}
          {children}
          {rightIcon && <View className="shrink-0">{rightIcon}</View>}
        </View>
      );

      if (onPress) {
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled, selected }}
            className="active:opacity-70"
            onPress={disabled ? undefined : onPress}
          >
            {chipContent}
          </Pressable>
        );
      }

      return chipContent;
    },
  ),
);

Badge.displayName = "Badge";
Chip.displayName = "Chip";

export { Badge, Chip, badgeVariants, chipVariants };
