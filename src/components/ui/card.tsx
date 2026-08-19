import { memo, type ReactNode } from "react";
import { View, type ViewProps } from "react-native";

import { cn } from "@/utils/classname";

type CardPartProps = ViewProps & {
  className?: string;
  children?: ReactNode;
};

export const Card = memo(function Card({ className, children, ...props }: CardPartProps) {
  return (
    <View className={cn("overflow-hidden rounded-xl border border-border bg-surface-primary", className)} {...props}>
      {children}
    </View>
  );
});

export const CardHeader = memo(function CardHeader({ className, children, ...props }: CardPartProps) {
  return (
    <View className={cn("gap-1 px-4 pt-4", className)} {...props}>
      {children}
    </View>
  );
});

export const CardBody = memo(function CardBody({ className, children, ...props }: CardPartProps) {
  return (
    <View className={cn("px-4 py-3", className)} {...props}>
      {children}
    </View>
  );
});

export const CardFooter = memo(function CardFooter({ className, children, ...props }: CardPartProps) {
  return (
    <View className={cn("px-4 pb-4", className)} {...props}>
      {children}
    </View>
  );
});
