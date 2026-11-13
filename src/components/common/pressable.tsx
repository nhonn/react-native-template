import { type ComponentRef, forwardRef } from "react";
import { Pressable as GHPressable, type PressableProps as GHPressableProps } from "react-native-gesture-handler";

export type PressableProps = GHPressableProps;

export type PressableRef = ComponentRef<typeof GHPressable>;

const Pressable = forwardRef<PressableRef, PressableProps>(({ children, ...props }, ref) => {
  return (
    <GHPressable ref={ref} {...props}>
      {children}
    </GHPressable>
  );
});

Pressable.displayName = "Pressable";

export { Pressable };
