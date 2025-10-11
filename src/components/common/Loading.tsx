import { cva, type VariantProps } from "class-variance-authority";
import { memo } from "react";
import { ActivityIndicator, View, type ViewProps } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

import { useThemeColors } from "@/theme";
import { cn } from "@/utils/classname";

const loadingVariants = cva("items-center justify-center", {
  variants: {
    size: {
      sm: "h-8 w-8",
      md: "h-12 w-12",
      lg: "h-16 w-16",
      xl: "h-24 w-24",
    },
    variant: {
      spinner: "",
      dots: "flex-row gap-1",
      pulse: "rounded-lg bg-surface-secondary",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "spinner",
  },
});

export interface LoadingProps extends ViewProps, VariantProps<typeof loadingVariants> {
  className?: string;
}

const Loading = memo<LoadingProps>(({ size, variant, className, ...props }) => {
  const colors = useThemeColors();
  const opacity = useSharedValue(1);

  if (variant === "pulse") {
    opacity.value = withRepeat(withTiming(0.3, { duration: 1000 }), -1, true);
  }

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: variant === "pulse" ? opacity.value : 1,
  }));

  const renderContent = () => {
    switch (variant) {
      case "spinner":
        return <ActivityIndicator color={colors.text.primary} size={size === "sm" ? "small" : "large"} />;

      case "dots":
        return <DotsLoader size={size ?? "md"} />;

      case "pulse":
        return null;

      default:
        return <ActivityIndicator color={colors.text.primary} size={size === "sm" ? "small" : "large"} />;
    }
  };

  return (
    <Animated.View className={cn(loadingVariants({ size, variant }), className)} style={animatedStyle} {...props}>
      {renderContent()}
    </Animated.View>
  );
});

const Dot = memo<{ size: number; color: string }>(({ size, color }) => {
  const scale = useSharedValue(1);

  scale.value = withRepeat(withTiming(1.5, { duration: 600 }), -1, true);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
      ]}
    />
  );
});

const DotsLoader = memo<{ size?: "sm" | "md" | "lg" | "xl" }>(({ size = "md" }) => {
  const colors = useThemeColors();

  const dotSize = {
    sm: 4,
    md: 6,
    lg: 8,
    xl: 10,
  }[size];

  return (
    <>
      <Dot color={colors.text.primary} size={dotSize} />
      <Dot color={colors.text.primary} size={dotSize} />
      <Dot color={colors.text.primary} size={dotSize} />
    </>
  );
});

// Skeleton Components
const skeletonVariants = cva("bg-surface-secondary", {
  variants: {
    variant: {
      text: "h-4 rounded",
      title: "h-6 rounded",
      avatar: "rounded-full",
      button: "h-10 rounded-lg",
      card: "rounded-xl",
      image: "rounded-lg",
    },
    width: {
      full: "w-full",
      "3/4": "w-3/4",
      "1/2": "w-1/2",
      "1/3": "w-1/3",
      "1/4": "w-1/4",
    },
  },
  defaultVariants: {
    variant: "text",
    width: "full",
  },
});

export interface SkeletonProps extends ViewProps {
  variant?: "text" | "title" | "avatar" | "button" | "card" | "image";
  widthVariant?: "full" | "3/4" | "1/2" | "1/3" | "1/4";
  className?: string;
  height?: number;
  width?: number;
}

const Skeleton = memo<SkeletonProps>(
  ({ variant = "text", widthVariant = "full", className, height, width, style, ...props }) => {
    const opacity = useSharedValue(1);

    opacity.value = withRepeat(withTiming(0.5, { duration: 1000 }), -1, true);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));

    const customStyle = {
      ...(height && { height }),
      ...(width && { width }),
    };

    return (
      <Animated.View
        className={cn(skeletonVariants({ variant, width: widthVariant }), className)}
        style={[animatedStyle, customStyle, style]}
        {...props}
      />
    );
  },
);

// Preset Skeleton Layouts
const SkeletonCard = memo<{ className?: string }>(({ className }) => (
  <View className={cn("space-y-3 p-4", className)}>
    <Skeleton height={200} variant="image" />
    <Skeleton variant="title" widthVariant="3/4" />
    <Skeleton variant="text" widthVariant="full" />
    <Skeleton variant="text" widthVariant="1/2" />
  </View>
));

const SkeletonList = memo<{ items?: number; className?: string }>(({ items = 3, className }) => (
  <View className={cn("space-y-4", className)}>
    {Array.from({ length: items }, (_, index) => (
      <View className="flex-row items-center space-x-3" key={`skeleton-item-${Date.now()}-${index}`}>
        <Skeleton height={40} variant="avatar" width={40} />
        <View className="flex-1 space-y-2">
          <Skeleton variant="text" widthVariant="3/4" />
          <Skeleton variant="text" widthVariant="1/2" />
        </View>
      </View>
    ))}
  </View>
));

const SkeletonProfile = memo<{ className?: string }>(({ className }) => (
  <View className={cn("items-center space-y-4 p-6", className)}>
    <Skeleton height={80} variant="avatar" width={80} />
    <Skeleton variant="title" widthVariant="1/2" />
    <Skeleton variant="text" widthVariant="3/4" />
    <View className="w-full space-y-2">
      <Skeleton variant="button" />
      <Skeleton variant="button" />
    </View>
  </View>
));

Loading.displayName = "Loading";
Skeleton.displayName = "Skeleton";
SkeletonCard.displayName = "SkeletonCard";
SkeletonList.displayName = "SkeletonList";
SkeletonProfile.displayName = "SkeletonProfile";

export { Loading, Skeleton, SkeletonCard, SkeletonList, SkeletonProfile };
