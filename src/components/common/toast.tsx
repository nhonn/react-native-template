import { Text, View } from "@tamagui/tailwind";
import { useEffect } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Portal } from "react-native-teleport";

import { styledNative } from "./styled-native";

const DEFAULT_TAB_BAR_HEIGHT = 49;

// shadow-md from the theme shadows (offset 0/4, radius 6, opacity 0.1). The Android
// `elevation: 4` the old style spread in has no Tailwind equivalent in this grammar.
const ToastBox = styledNative(
  Animated.View,
  "max-w-[90%] rounded-lg bg-text-primary px-4 py-3 shadow-[0px_4px_6px_rgba(0,0,0,0.1)]",
);

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  durationMs?: number;
  /**
   * Distance from the screen bottom that the toast should clear. Tab screens
   * pass `useBottomTabBarHeight()` (already includes the bottom inset); other
   * callers can omit it and get the safe-area inset plus a default tab height.
   */
  offsetBottom?: number;
}

/**
 * Transient overlay rendered through `react-native-teleport`'s root portal, so
 * it sits above the navigator and tab bar without a system Modal or zIndex
 * stacking hacks. Owns its auto-dismiss timer; the caller only toggles
 * `visible`.
 */
export function Toast({ message, visible, onHide, durationMs = 2000, offsetBottom }: ToastProps) {
  const insets = useSafeAreaInsets();
  const bottom = offsetBottom ?? DEFAULT_TAB_BAR_HEIGHT + insets.bottom;

  useEffect(() => {
    if (!visible) {
      return;
    }
    const timeout = setTimeout(onHide, durationMs);
    return () => clearTimeout(timeout);
  }, [durationMs, onHide, visible]);

  if (!visible) {
    return null;
  }

  return (
    <Portal hostName="root" name="toast">
      <View className="pointer-events-none absolute inset-x-0 items-center px-4" style={{ bottom }}>
        <ToastBox
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
          accessible
          entering={FadeInDown.duration(180)}
        >
          <Text className="text-[15px] font-medium text-background-primary">{message}</Text>
        </ToastBox>
      </View>
    </Portal>
  );
}
