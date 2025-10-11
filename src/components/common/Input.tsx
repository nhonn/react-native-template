import { cva, type VariantProps } from "class-variance-authority";
import { Eye, EyeOff, Search } from "lucide-react-native";
import { forwardRef, memo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { useThemeColors } from "@/theme";
import { cn } from "@/utils/classname";

const inputVariants = cva(
  "border border-border bg-background px-3 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "rounded-lg",
        search: "rounded-full pl-10",
      },
      size: {
        sm: "px-3 py-2 text-sm",
        default: "px-3 py-3 text-base",
        lg: "px-4 py-4 text-lg",
      },
      state: {
        default: "border-border",
        error: "border-destructive focus:border-destructive",
        success: "border-success focus:border-success",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "default",
    },
  },
);

const labelVariants = cva("mb-2 font-medium text-foreground text-sm", {
  variants: {
    state: {
      default: "text-foreground",
      error: "text-destructive",
      success: "text-success",
    },
  },
  defaultVariants: {
    state: "default",
  },
});

const helperTextVariants = cva("mt-1 text-xs", {
  variants: {
    state: {
      default: "text-muted-foreground",
      error: "text-destructive",
      success: "text-success",
    },
  },
  defaultVariants: {
    state: "default",
  },
});

export interface InputProps
  extends React.ComponentPropsWithoutRef<typeof TextInput>,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export interface PasswordInputProps extends Omit<InputProps, "variant"> {
  variant?: never;
}

export interface SearchInputProps extends Omit<InputProps, "variant" | "leftIcon"> {
  variant?: never;
  leftIcon?: never;
  onClear?: () => void;
}

export interface TextareaProps extends Omit<InputProps, "variant"> {
  variant?: never;
  numberOfLines?: number;
}

const Input = memo(
  forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
    (
      { className, variant, size, state, label, helperText, error, leftIcon, rightIcon, containerClassName, ...props },
      ref,
    ) => {
      const colors = useThemeColors();
      const finalState = error ? "error" : state;
      const finalHelperText = error || helperText;

      return (
        <View className={cn("w-full", containerClassName)}>
          {label && <Text className={labelVariants({ state: finalState })}>{label}</Text>}
          <View className="relative">
            {leftIcon && <View className="-translate-y-1/2 absolute top-1/2 left-3 z-10">{leftIcon}</View>}
            <TextInput
              className={cn(
                inputVariants({ variant, size, state: finalState }),
                leftIcon && "pl-10",
                rightIcon && "pr-10",
                className,
              )}
              placeholderTextColor={colors.text.tertiary}
              ref={ref}
              {...props}
            />
            {rightIcon && <View className="-translate-y-1/2 absolute top-1/2 right-3 z-10">{rightIcon}</View>}
          </View>
          {finalHelperText && <Text className={helperTextVariants({ state: finalState })}>{finalHelperText}</Text>}
        </View>
      );
    },
  ),
);

const PasswordInput = memo(
  forwardRef<React.ElementRef<typeof TextInput>, PasswordInputProps>(({ rightIcon, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const colors = useThemeColors();

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const eyeIcon = (
      <Pressable
        accessibilityLabel={showPassword ? "Hide password" : "Show password"}
        accessibilityRole="button"
        className="p-1"
        onPress={togglePasswordVisibility}
      >
        {showPassword ? (
          <EyeOff color={colors.text.tertiary} size={20} />
        ) : (
          <Eye color={colors.text.tertiary} size={20} />
        )}
      </Pressable>
    );

    return <Input ref={ref} rightIcon={eyeIcon} secureTextEntry={!showPassword} {...props} />;
  }),
);

const SearchInput = memo(
  forwardRef<React.ElementRef<typeof TextInput>, SearchInputProps>(({ onClear, value, ...props }, ref) => {
    const colors = useThemeColors();

    const searchIcon = <Search color={colors.text.tertiary} size={20} />;

    const clearButton = value && onClear && (
      <Pressable accessibilityLabel="Clear search" accessibilityRole="button" className="p-1" onPress={onClear}>
        <Text className="text-muted-foreground">×</Text>
      </Pressable>
    );

    return <Input leftIcon={searchIcon} ref={ref} rightIcon={clearButton} value={value} variant="search" {...props} />;
  }),
);

const Textarea = memo(
  forwardRef<React.ElementRef<typeof TextInput>, TextareaProps>(({ numberOfLines = 4, ...props }, ref) => {
    return <Input multiline numberOfLines={numberOfLines} ref={ref} textAlignVertical="top" {...props} />;
  }),
);

Input.displayName = "Input";
PasswordInput.displayName = "PasswordInput";
SearchInput.displayName = "SearchInput";
Textarea.displayName = "Textarea";

export type InputVariant = VariantProps<typeof inputVariants>["variant"];
export type InputSize = VariantProps<typeof inputVariants>["size"];
export type InputState = VariantProps<typeof inputVariants>["state"];

export { Input, PasswordInput, SearchInput, Textarea, inputVariants };
