import { View } from "@tamagui/tailwind";
import type { ReactNode } from "react";

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
    <Pressable accessibilityLabel={accessibilityLabel} accessibilityRole="button" hitSlop={12} onPress={onPress}>
      {({ pressed }) => (
        <View className={pressed ? "size-6 items-center justify-center opacity-50" : "size-6 items-center justify-center"}>
          {children}
        </View>
      )}
    </Pressable>
  );
}
