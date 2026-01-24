import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, memo, useState } from "react";
import { Image as ExpoImage, type ImageErrorEvent, type ImageLoadEvent, Pressable, View } from "react-native";
import { Typography } from "@/components/common";
import { useThemeColors } from "@/theme";
import { cn } from "@/utils/classname";

const avatarVariants = cva("overflow-hidden", {
  variants: {
    size: {
      xs: "h-6 w-6",
      sm: "h-8 w-8",
      md: "h-12 w-12",
      lg: "h-16 w-16",
      xl: "h-20 w-20",
      "2xl": "h-24 w-24",
    },
    shape: {
      circle: "rounded-full",
      square: "rounded-lg",
    },
  },
  defaultVariants: {
    size: "md",
    shape: "circle",
  },
});

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  src?: string | null;
  alt?: string;
  initials?: string;
  fallback?: React.ReactNode;
  onPress?: () => void;
  className?: string;
  imageClassName?: string;
  onLoad?: (event: ImageLoadEvent) => void;
  onError?: (error: ImageErrorEvent) => void;
}

export interface AvatarRef {
  ref?: any;
}

const Avatar = memo(
  forwardRef<AvatarRef, AvatarProps>(
    (
      {
        src,
        alt,
        initials,
        fallback,
        size = "md",
        shape = "circle",
        onPress,
        className,
        imageClassName,
        onLoad,
        onError,
      },
      _ref,
    ) => {
      const colors = useThemeColors();
      const [hasError, setHasError] = useState(false);

      const handleLoad = (event: ImageLoadEvent) => {
        setHasError(false);
        onLoad?.(event);
      };

      const handleError = (error: ImageErrorEvent) => {
        setHasError(true);
        onError?.(error);
      };

      const renderFallback = () => {
        if (fallback) {
          return <View className="flex-1 items-center justify-center bg-surface-secondary">{fallback}</View>;
        }

        if (initials) {
          const fontSize = (
            {
              xs: "text-xs",
              sm: "text-sm",
              md: "text-base",
              lg: "text-xl",
              xl: "text-2xl",
              "2xl": "text-3xl",
            } as const
          )[size || "md"];

          return (
            <View
              className="flex-1 items-center justify-center bg-surface-secondary"
              style={{ backgroundColor: colors.text.tertiary }}
            >
              <Typography className={`font-bold text-white ${fontSize}`} variant="label">
                {initials}
              </Typography>
            </View>
          );
        }

        return (
          <View
            className="flex-1 items-center justify-center bg-surface-secondary"
            style={{ backgroundColor: colors.text.tertiary }}
          >
            <View className="h-2/3 w-2/3 rounded-full" style={{ backgroundColor: colors.surface.primary }} />
          </View>
        );
      };

      const avatarContent = (
        <View className={cn(avatarVariants({ size, shape }), className)}>
          {src && !hasError ? (
            <ExpoImage
              className={cn("h-full w-full", imageClassName)}
              onError={handleError}
              onLoad={handleLoad}
              source={{ uri: src || undefined }}
              style={{
                backgroundColor: colors.surface.secondary,
              }}
            />
          ) : (
            renderFallback()
          )}
        </View>
      );

      if (onPress) {
        return (
          <Pressable
            accessibilityLabel={alt || "Avatar"}
            accessibilityRole="imagebutton"
            className="active:opacity-70"
            onPress={onPress}
          >
            {avatarContent}
          </Pressable>
        );
      }

      return (
        <View accessibilityLabel={alt || "Avatar"} accessibilityRole="image">
          {avatarContent}
        </View>
      );
    },
  ),
);

Avatar.displayName = "Avatar";

export { Avatar, avatarVariants };
