import { forwardRef, memo, type ReactNode } from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";
import { Pressable as GHPressable, type PressableProps as GHPressableProps } from "react-native-gesture-handler";

export type PressableProps = Omit<GHPressableProps, "style" | "children"> & {
  children?: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

const Pressable = memo(
  forwardRef<View, PressableProps>(({ children, className, style, ...props }, ref) => {
    const fillsParent = typeof className === "string" && className.split(/\s+/).includes("flex-1");

    return (
      <GHPressable style={fillsParent ? { flex: 1 } : undefined} {...props}>
        <View className={className} collapsable={false} ref={ref} style={style}>
          {children}
        </View>
      </GHPressable>
    );
  }),
);

Pressable.displayName = "Pressable";

export { Pressable };
