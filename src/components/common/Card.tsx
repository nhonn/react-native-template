import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, memo } from "react";
import { Pressable, View, type ViewProps } from "react-native";

import { cn } from "@/utils/classname";

const cardVariants = cva("overflow-hidden", {
  variants: {
    variant: {
      default: "border border-border bg-surface-primary",
      elevated: "border border-border bg-surface-primary shadow-md",
      outlined: "border-2 border-border bg-transparent",
      ghost: "bg-transparent",
    },
    size: {
      sm: "rounded-md p-3",
      md: "rounded-lg p-4",
      lg: "rounded-xl p-6",
    },
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
      full: "rounded-full",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    rounded: "lg",
  },
});

export interface CardProps extends ViewProps, VariantProps<typeof cardVariants> {
  className?: string;
  contentClassName?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}

const Card = memo(
  forwardRef<View, CardProps>(
    (
      {
        className,
        contentClassName,
        header,
        footer,
        variant = "default",
        size = "md",
        rounded,
        onPress,
        disabled = false,
        children,
        ...props
      },
      ref,
    ) => {
      const cardContent = (
        <View className={cn(cardVariants({ variant, size, rounded }), className)} ref={ref} {...props}>
          {header && <View className="mb-3">{header}</View>}
          <View className={contentClassName}>{children}</View>
          {footer && <View className="mt-3">{footer}</View>}
        </View>
      );

      if (onPress) {
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled }}
            className="active:opacity-70"
            onPress={disabled ? undefined : onPress}
          >
            {cardContent}
          </Pressable>
        );
      }

      return cardContent;
    },
  ),
);

Card.displayName = "Card";

export { Card, cardVariants };
