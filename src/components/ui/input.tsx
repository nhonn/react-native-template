import { forwardRef, memo } from "react";
import { TextInput, type TextInputProps, View } from "react-native";

import { cn } from "@/utils/classname";

import { Text } from "./text";

export type InputProps = TextInputProps & {
  className?: string;
  label?: string;
  error?: string;
};

export const Input = memo(
  forwardRef<TextInput, InputProps>(function Input(
    { className, label, error, editable = true, placeholderTextColor, ...props },
    ref,
  ) {
    const hasError = Boolean(error);

    return (
      <View className="w-full gap-1.5">
        {label ? <Text variant="label">{label}</Text> : null}
        <TextInput
          className={cn(
            "min-h-11 rounded-lg border px-3 py-2.5 text-base text-foreground",
            hasError ? "border-error" : "border-border",
            !editable && "opacity-50",
            className,
          )}
          editable={editable}
          placeholderTextColor={placeholderTextColor}
          ref={ref}
          {...props}
        />
        {hasError ? <Text variant="error">{error}</Text> : null}
      </View>
    );
  }),
);
