import { memo } from "react";
import { View, type ViewProps } from "react-native";

import { cn } from "@/utils/classname";

export type DividerProps = ViewProps & {
  className?: string;
  orientation?: "horizontal" | "vertical";
};

export const Divider = memo(function Divider({ className, orientation = "horizontal", ...props }: DividerProps) {
  return (
    <View
      accessibilityRole="none"
      className={cn("bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className)}
      {...props}
    />
  );
});
