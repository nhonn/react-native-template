import { Canvas, Circle, RadialGradient, vec } from "react-native-skia";
import { Easing, useDerivedValue, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { useEffect } from "react";
import { StyleSheet } from "react-native-unistyles";

import { useTheme } from "@/theme/hooks/useTheme";

const PULSE_DURATION_MS = 1800;

/**
 * Skia demo: a pulsing, gradient-filled circle driven by a Reanimated shared
 * value. Colors come from the active theme, so the canvas follows light/dark.
 */
export function PulseCanvas() {
  const { theme } = useTheme();
  const size = useSharedValue({ width: 0, height: 0 });
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(
      withRepeat(withTiming(1, { duration: PULSE_DURATION_MS, easing: Easing.inOut(Easing.ease) }), -1, true),
    );
  }, [progress]);

  const center = useDerivedValue(() => vec(size.value.width / 2, size.value.height / 2));
  const radius = useDerivedValue(
    () => (Math.min(size.value.width, size.value.height) / 4) * (0.75 + 0.25 * progress.value),
  );
  const ringRadius = useDerivedValue(() => radius.value * (1.15 + 0.35 * progress.value));
  const ringOpacity = useDerivedValue(() => 1 - progress.value);

  return (
    <Canvas style={styles.canvas} onSize={size}>
      <Circle
        c={center}
        r={ringRadius}
        color={theme.colors.interactive.primary}
        style="stroke"
        strokeWidth={2}
        opacity={ringOpacity}
      />
      <Circle c={center} r={radius}>
        <RadialGradient
          c={center}
          r={radius}
          colors={[theme.colors.interactive.primaryHover, theme.colors.interactive.primary]}
        />
      </Circle>
    </Canvas>
  );
}

const styles = StyleSheet.create((theme) => ({
  canvas: {
    height: 180,
    marginHorizontal: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface.elevated,
  },
}));
