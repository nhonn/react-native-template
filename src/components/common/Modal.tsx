import { forwardRef, memo, useEffect, useImperativeHandle, useState } from "react";
import { Dimensions, Pressable, Modal as RNModal, type ModalProps as RNModalProps, View } from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeColors } from "@/theme";
import { cn } from "@/utils/classname";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export interface ModalProps extends Omit<RNModalProps, "visible" | "onRequestClose"> {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  position?: "center" | "top" | "bottom";
  closeOnOverlayPress?: boolean;
  showCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
}

interface ModalRef {
  open: () => void;
  close: () => void;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "w-full h-full",
};

const positionClasses = {
  center: "items-center justify-center",
  top: "items-center justify-start pt-20",
  bottom: "items-center justify-end pb-20",
};

const Modal = memo(
  forwardRef<ModalRef, ModalProps>(
    (
      {
        isOpen,
        onClose,
        children,
        size = "md",
        position = "center",
        closeOnOverlayPress = true,
        showCloseButton = false,
        className,
        overlayClassName,
        ...props
      },
      ref,
    ) => {
      const colors = useThemeColors();
      const insets = useSafeAreaInsets();
      const [visible, setVisible] = useState(false);

      const overlayOpacity = useSharedValue(0);
      const modalScale = useSharedValue(0.9);
      const modalTranslateY = useSharedValue(position === "bottom" ? SCREEN_HEIGHT : 0);

      useImperativeHandle(ref, () => ({
        open: () => setVisible(true),
        close: onClose,
      }));

      useEffect(() => {
        if (isOpen) {
          setVisible(true);
          overlayOpacity.value = withTiming(1, { duration: 200 });
          modalScale.value = withSpring(1, { damping: 20, stiffness: 300 });
          modalTranslateY.value = withSpring(0, { damping: 20, stiffness: 300 });
        } else {
          overlayOpacity.value = withTiming(0, { duration: 200 });
          modalScale.value = withTiming(0.9, { duration: 200 });
          modalTranslateY.value = withTiming(
            position === "bottom" ? SCREEN_HEIGHT : 0,
            { duration: 200 },
            (finished) => {
              if (finished) {
                runOnJS(setVisible)(false);
              }
            },
          );
        }
      }, [isOpen, overlayOpacity, modalScale, modalTranslateY, position]);

      const overlayAnimatedStyle = useAnimatedStyle(() => ({
        opacity: overlayOpacity.value,
      }));

      const modalAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: position === "center" ? modalScale.value : 1 }, { translateY: modalTranslateY.value }],
      }));

      const handleOverlayPress = () => {
        if (closeOnOverlayPress) {
          onClose();
        }
      };

      return (
        <RNModal
          animationType="none"
          onRequestClose={onClose}
          statusBarTranslucent
          transparent
          visible={visible}
          {...props}
        >
          <View className="flex-1" style={{ paddingTop: insets.top }}>
            <Animated.View
              className={cn("absolute inset-0", overlayClassName)}
              style={[overlayAnimatedStyle, { backgroundColor: colors.surface.overlay }]}
            >
              <Pressable className="flex-1" onPress={handleOverlayPress} />
            </Animated.View>

            <View className={cn("flex-1 px-4", positionClasses[position])}>
              <Animated.View
                className={cn(
                  "rounded-xl bg-surface-primary p-6 shadow-lg",
                  sizeClasses[size],
                  size !== "full" && "mx-4",
                  className,
                )}
                style={modalAnimatedStyle}
              >
                {showCloseButton && (
                  <Pressable
                    accessibilityLabel="Close modal"
                    accessibilityRole="button"
                    className="absolute top-4 right-4 z-10 p-2"
                    onPress={onClose}
                  >
                    <View className="h-6 w-6 items-center justify-center">
                      <View className="h-0.5 w-4 rotate-45 bg-text-secondary" />
                      <View className="-rotate-45 absolute h-0.5 w-4 bg-text-secondary" />
                    </View>
                  </Pressable>
                )}
                {children}
              </Animated.View>
            </View>
          </View>
        </RNModal>
      );
    },
  ),
);

Modal.displayName = "Modal";

export { Modal, type ModalRef };
