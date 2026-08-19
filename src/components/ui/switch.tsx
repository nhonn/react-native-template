import { memo } from "react";
import { Switch as RNSwitch, type SwitchProps as RNSwitchProps } from "react-native";

import { useThemeColors } from "@/theme/hooks/useTheme";

export type SwitchProps = Omit<RNSwitchProps, "value" | "onValueChange"> & {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export const Switch = memo(function Switch({
  checked,
  onCheckedChange,
  disabled,
  accessibilityLabel,
  ...props
}: SwitchProps) {
  const colors = useThemeColors();

  return (
    <RNSwitch
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled: Boolean(disabled) }}
      disabled={disabled}
      onValueChange={onCheckedChange}
      thumbColor={colors.surface.primary}
      trackColor={{ false: colors.border.primary, true: colors.interactive.primary }}
      value={checked}
      {...props}
    />
  );
});
