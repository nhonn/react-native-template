import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Portal } from "react-native-teleport";
import { StyleSheet } from "react-native-unistyles";

const DEFAULT_TAB_BAR_HEIGHT = 49;

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
      <View pointerEvents="none" style={[styles.container, { bottom }]}>
        <Animated.View
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
          accessible
          entering={FadeInDown.duration(180)}
          style={styles.toast}
        >
          <Text style={styles.text}>{message}</Text>
        </Animated.View>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: theme.spacing[4],
  },
  toast: {
    maxWidth: "90%",
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.text.primary,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    ...theme.shadows.md,
  },
  text: {
    color: theme.colors.background.primary,
    fontSize: 15,
    fontWeight: "500",
  },
}));
