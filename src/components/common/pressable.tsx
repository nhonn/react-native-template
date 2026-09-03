import { forwardRef, memo, type ReactNode } from "react";
import type { StyleProp, View, ViewStyle } from "react-native";
import { Pressable as GHPressable, type PressableProps as GHPressableProps } from "react-native-gesture-handler";

export type PressableProps = Omit<GHPressableProps, "style" | "children"> & {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const Pressable = memo(
  forwardRef<View, PressableProps>(({ children, style, ...props }, ref) => {
    return (
      <GHPressable ref={ref} style={style} {...props}>
        {children}
      </GHPressable>
    );
  }),
);

Pressable.displayName = "Pressable";

export { Pressable };
