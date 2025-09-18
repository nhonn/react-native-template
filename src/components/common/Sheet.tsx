import { forwardRef, memo, useEffect, useImperativeHandle, useState } from "react";
import { Dimensions, Modal, type ModalProps, Pressable, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeColors } from "@/theme";
import { cn } from "@/utils/classname";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export interface SheetProps extends Omit<ModalProps, "visible" | "onRequestClose"> {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: number[];
  initialSnapPoint?: number;
  closeOnOverlayPress?: boolean;
  showHandle?: boolean;
  className?: string;
  overlayClassName?: string;
}

interface SheetRef {
  open: () => void;
  close: () => void;
  snapTo: (index: number) => void;
}

const Sheet = memo(
  forwardRef<SheetRef, SheetProps>(
    (
      {
        isOpen,
        onClose,
        children,
        snapPoints = [0.5, 0.9],
        initialSnapPoint = 0,
        closeOnOverlayPress = true,
        showHandle = true,
        className,
        overlayClassName,
        ...props
      },
      ref,
    ) => {
      const colors = useThemeColors();
      const insets = useSafeAreaInsets();
      const [visible, setVisible] = useState(false);

      const translateY = useSharedValue(SCREEN_HEIGHT);
      const overlayOpacity = useSharedValue(0);

      const snapPointsInPixels = snapPoints.map((point) => SCREEN_HEIGHT * (1 - point));
      const maxHeight = SCREEN_HEIGHT * (snapPoints.at(-1) ?? 0.9);

      useImperativeHandle(ref, () => ({
        open: () => setVisible(true),
        close: onClose,
        snapTo: (index: number) => {
          if (index >= 0 && index < snapPoints.length) {
            translateY.value = withSpring(snapPointsInPixels[index], {
              damping: 20,
              stiffness: 300,
            });
          }
        },
      }));

      useEffect(() => {
        if (isOpen) {
          setVisible(true);
          overlayOpacity.value = withTiming(1, { duration: 300 });
          translateY.value = withSpring(snapPointsInPixels[initialSnapPoint], {
            damping: 20,
            stiffness: 300,
          });
        } else {
          overlayOpacity.value = withTiming(0, { duration: 200 });
          translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200 }, (finished) => {
            if (finished) {
              runOnJS(setVisible)(false);
            }
          });
        }
      }, [isOpen, overlayOpacity, translateY, snapPointsInPixels, initialSnapPoint]);

      const panGesture = Gesture.Pan()
        .onStart(() => {
          // Store the starting position
        })
        .onUpdate((event) => {
          translateY.value = Math.max(snapPointsInPixels[snapPoints.length - 1], event.translationY);
        })
        .onEnd((event) => {
          const velocity = event.velocityY;
          const currentY = translateY.value;

          // Find the closest snap point
          let closestSnapIndex = 0;
          let minDistance = Math.abs(currentY - snapPointsInPixels[0]);

          for (let i = 1; i < snapPointsInPixels.length; i++) {
            const distance = Math.abs(currentY - snapPointsInPixels[i]);
            if (distance < minDistance) {
              minDistance = distance;
              closestSnapIndex = i;
            }
          }

          // Consider velocity for snap decision
          if (velocity > 500 && closestSnapIndex > 0) {
            closestSnapIndex = Math.max(0, closestSnapIndex - 1);
          } else if (velocity < -500 && closestSnapIndex < snapPoints.length - 1) {
            closestSnapIndex = Math.min(snapPoints.length - 1, closestSnapIndex + 1);
          }

          // Close if dragged below the first snap point
          if (currentY > snapPointsInPixels[0] + 100 || velocity > 1000) {
            translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200 });
            overlayOpacity.value = withTiming(0, { duration: 200 });
            runOnJS(onClose)();
          } else {
            translateY.value = withSpring(snapPointsInPixels[closestSnapIndex], {
              damping: 20,
              stiffness: 300,
            });
          }
        });

      const overlayAnimatedStyle = useAnimatedStyle(() => ({
        opacity: overlayOpacity.value,
      }));

      const sheetAnimatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
          translateY.value,
          [snapPointsInPixels.at(-1) ?? 0, SCREEN_HEIGHT],
          [1, 0],
          Extrapolate.CLAMP,
        );

        return {
          transform: [{ translateY: translateY.value }],
          opacity,
        };
      });

      const handleOverlayPress = () => {
        if (closeOnOverlayPress) {
          onClose();
        }
      };

      return (
        <Modal
          animationType="none"
          onRequestClose={onClose}
          statusBarTranslucent
          transparent
          visible={visible}
          {...props}
        >
          <View className="flex-1">
            <Animated.View
              className={cn("absolute inset-0", overlayClassName)}
              style={[overlayAnimatedStyle, { backgroundColor: colors.surface.overlay }]}
            >
              <Pressable className="flex-1" onPress={handleOverlayPress} />
            </Animated.View>

            <GestureDetector gesture={panGesture}>
              <Animated.View
                className={cn("absolute right-0 bottom-0 left-0 rounded-t-3xl bg-surface-primary", className)}
                style={[sheetAnimatedStyle, { maxHeight }]}
              >
                {showHandle && (
                  <View className="items-center py-3">
                    <View className="h-1 w-10 rounded-full bg-border" />
                  </View>
                )}

                <View className="flex-1 px-4 pb-4" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
                  {children}
                </View>
              </Animated.View>
            </GestureDetector>
          </View>
        </Modal>
      );
    },
  ),
);

Sheet.displayName = "Sheet";

export { Sheet, type SheetRef };
