import { memo, type ReactNode } from "react";
import { tv } from "tailwind-variants";

import { Pressable, type PressableProps } from "@/components/common/pressable";
import { cn } from "@/utils/classname";

import { Spinner } from "./spinner";
import { Text } from "./text";

const buttonStyles = tv({
  base: "flex-row items-center justify-center rounded-lg",
  variants: {
    variant: {
      primary: "bg-interactive-primary",
      secondary: "bg-interactive-secondary",
      ghost: "bg-transparent",
      destructive: "bg-error",
    },
    size: {
      sm: "min-h-9 px-3 py-1.5",
      md: "min-h-11 px-4 py-2.5",
      lg: "min-h-12 px-5 py-3",
    },
    disabled: {
      true: "opacity-50",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

const labelStyles = tv({
  variants: {
    variant: {
      primary: "text-white",
      secondary: "text-foreground",
      ghost: "text-foreground",
      destructive: "text-white",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = Omit<PressableProps, "children"> & {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

export const Button = memo(function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  accessibilityRole = "button",
  ...props
}: ButtonProps) {
  const isDisabled = Boolean(disabled || loading);

  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={cn(buttonStyles({ variant, size, disabled: isDisabled }), className)}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <Spinner size={size === "lg" ? "md" : "sm"} />
      ) : typeof children === "string" || typeof children === "number" ? (
        <Text className={labelStyles({ variant })} variant="button">
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
});
