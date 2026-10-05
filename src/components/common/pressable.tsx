import { type ComponentRef, forwardRef, type ReactNode } from "react";
import { Pressable as GHPressable, type PressableProps as GHPressableProps } from "react-native-gesture-handler";

export type PressableProps = Omit<GHPressableProps, "children"> & {
  children?: ReactNode;
};

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
