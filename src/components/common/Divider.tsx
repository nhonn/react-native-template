import { cva, type VariantProps } from "class-variance-authority";
import { memo } from "react";
import { View, type ViewProps } from "react-native";

import { cn } from "@/utils/classname";
import { Typography } from "./Typography";

const dividerVariants = cva("", {
  variants: {
    orientation: {
      horizontal: "w-full",
      vertical: "h-full",
    },
    variant: {
      solid: "bg-border",
      dashed: "border-border border-b border-dashed",
      dotted: "border-border border-b border-dotted",
    },
    thickness: {
      thin: "h-px",
      medium: "h-0.5",
      thick: "h-1",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    variant: "solid",
    thickness: "thin",
  },
});

export interface DividerProps extends ViewProps, VariantProps<typeof dividerVariants> {
  className?: string;
  label?: string;
  labelPosition?: "center" | "start" | "end";
}

const Divider = memo<DividerProps>(
  ({
    className,
    orientation = "horizontal",
    variant = "solid",
    thickness = "thin",
    label,
    labelPosition = "center",
    style,
    ...props
  }) => {
    if (!label) {
      return (
        <View
          className={cn(
            dividerVariants({ orientation, variant, thickness }),
            orientation === "vertical" ? "w-px" : "",
            className,
          )}
          style={style}
          {...props}
        />
      );
    }

    const labelPositionClasses = {
      center: "justify-center",
      start: "justify-start",
      end: "justify-end",
    }[labelPosition];

    let thicknessClass = "h-px";
    if (thickness === "medium") {
      thicknessClass = "h-0.5";
    } else if (thickness === "thick") {
      thicknessClass = "h-1";
    }

    if (orientation === "vertical") {
      return (
        <View className={cn("flex-row items-center", labelPositionClasses, className)} style={style} {...props}>
          <View className="h-px flex-1 bg-border" />
          <View className="px-2">
            <Typography className="text-text-secondary" variant="caption">
              {label}
            </Typography>
          </View>
          <View className="h-px flex-1 bg-border" />
        </View>
      );
    }

    return (
      <View className={cn("flex-row items-center", labelPositionClasses, className)} style={style} {...props}>
        <View className={cn("flex-1 bg-border", thicknessClass)} />
        {labelPosition !== "end" && (
          <View className="px-2">
            <Typography className="text-text-secondary" variant="caption">
              {label}
            </Typography>
          </View>
        )}
        {labelPosition === "center" && <View className={cn("flex-1 bg-border", thicknessClass)} />}
      </View>
    );
  },
);

Divider.displayName = "Divider";

export { Divider, dividerVariants };
