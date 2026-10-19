import type { ReactNode } from "react";
import { StyleSheet } from "react-native-unistyles";

import { Pressable } from "./pressable";

interface IconButtonProps {
  accessibilityLabel: string;
  onPress: () => void;
  children: ReactNode;
}

/**
 * Bare icon press target used in layout chrome. Keeps the 24pt glyph footprint
 * of the native text button it replaces while extending the touch target.
 */
export function IconButton({ accessibilityLabel, onPress, children }: IconButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      hitSlop={12}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.5 },
});
