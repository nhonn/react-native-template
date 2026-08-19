import { Check } from "phosphor-react-native/src/icons/Check";
import { memo } from "react";
import { View } from "react-native";

import { Pressable, type PressableProps } from "@/components/common/pressable";
import { useThemeColors } from "@/theme/hooks/useTheme";
import { cn } from "@/utils/classname";

import { Text } from "./text";

export type CheckboxProps = Omit<PressableProps, "children" | "onPress"> & {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
};

export const Checkbox = memo(function Checkbox({
  checked,
  onCheckedChange,
  label,
  className,
  disabled,
  accessibilityLabel,
  ...props
}: CheckboxProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled: Boolean(disabled) }}
      className={cn("flex-row items-center gap-2", disabled && "opacity-50", className)}
      disabled={disabled}
      onPress={() => onCheckedChange(!checked)}
      {...props}
    >
      <View
        className={cn(
          "h-5 w-5 items-center justify-center rounded border",
          checked ? "border-interactive-primary bg-interactive-primary" : "border-border bg-background",
        )}
      >
        {checked ? <Check color={colors.text.inverse} size={14} weight="bold" /> : null}
      </View>
      {label ? <Text variant="body">{label}</Text> : null}
    </Pressable>
  );
});
