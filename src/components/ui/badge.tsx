import { memo, type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { tv } from "tailwind-variants";

import { cn } from "@/utils/classname";

import { Text } from "./text";

const badgeStyles = tv({
  base: "self-start rounded-full px-2 py-0.5",
  variants: {
    variant: {
      default: "bg-interactive-secondary",
      success: "bg-success-background",
      warning: "bg-warning-background",
      error: "bg-error-background",
      info: "bg-info-background",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const badgeTextStyles = tv({
  variants: {
    variant: {
      default: "text-foreground",
      success: "text-success",
      warning: "text-warning",
      error: "text-error",
      info: "text-info",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type BadgeVariant = "default" | "success" | "warning" | "error" | "info";

export type BadgeProps = ViewProps & {
  className?: string;
  children?: ReactNode;
  variant?: BadgeVariant;
};

export const Badge = memo(function Badge({ className, children, variant = "default", ...props }: BadgeProps) {
  return (
    <View className={cn(badgeStyles({ variant }), className)} {...props}>
      {typeof children === "string" || typeof children === "number" ? (
        <Text className={badgeTextStyles({ variant })} variant="caption">
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
});
