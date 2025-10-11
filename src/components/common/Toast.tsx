import { cva } from "class-variance-authority";
import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeColors } from "@/theme";
import { cn } from "@/utils/classname";

const toastVariants = cva("mx-4 flex-row items-center justify-between rounded-lg p-4 shadow-lg", {
  variants: {
    variant: {
      default: "border border-border bg-surface-primary",
      success: "bg-semantic-success",
      error: "bg-semantic-error",
      warning: "bg-semantic-warning",
      info: "bg-interactive-primary",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const toastTextVariants = cva("font-medium text-sm", {
  variants: {
    variant: {
      default: "text-text-primary",
      success: "text-white",
      error: "text-white",
      warning: "text-text-primary",
      info: "text-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning" | "info";
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export interface ToastProps extends ToastData {
  onDismiss: (id: string) => void;
  index: number;
}

interface ToastRef {
  show: (toast: Omit<ToastData, "id">) => void;
  hide: (id: string) => void;
  hideAll: () => void;
}

const Toast = memo<ToastProps>(
  ({ id, title, description, variant = "default", duration = 4000, action, onDismiss, index }) => {
    const colors = useThemeColors();
    const insets = useSafeAreaInsets();

    const translateY = useSharedValue(-100);
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.9);

    const handleDismiss = useCallback(() => {
      translateY.value = withTiming(-100, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.9, { duration: 200 }, (finished) => {
        if (finished) {
          runOnJS(onDismiss)(id);
        }
      });
    }, [id, onDismiss, opacity, scale, translateY]);

    useEffect(() => {
      // Animate in
      translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1, { damping: 20, stiffness: 300 });

      // Auto dismiss
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, duration);

        return () => clearTimeout(timer);
      }
    }, [
      duration,
      handleDismiss,
      opacity,
      scale, // Animate in
      translateY,
    ]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }, { scale: scale.value }],
      opacity: opacity.value,
    }));

    const topOffset = insets.top + 16 + index * 80;

    return (
      <Animated.View
        style={[animatedStyle, { position: "absolute", top: topOffset, left: 0, right: 0, zIndex: 1000 + index }]}
      >
        <View className={cn(toastVariants({ variant }))}>
          <View className="flex-1">
            <Text className={cn(toastTextVariants({ variant }), "font-semibold")}>{title}</Text>
            {description && (
              <Text className={cn(toastTextVariants({ variant }), "mt-1 opacity-90")}>{description}</Text>
            )}
          </View>

          <View className="ml-3 flex-row items-center gap-2">
            {action && (
              <Pressable
                accessibilityLabel={action.label}
                accessibilityRole="button"
                className="rounded px-3 py-1"
                onPress={action.onPress}
                style={{ backgroundColor: colors.surface.overlay }}
              >
                <Text className={cn(toastTextVariants({ variant }), "font-medium text-xs")}>{action.label}</Text>
              </Pressable>
            )}

            <Pressable
              accessibilityLabel="Dismiss notification"
              accessibilityRole="button"
              className="p-1"
              onPress={handleDismiss}
            >
              <View className="h-4 w-4 items-center justify-center">
                <View
                  className={cn(
                    "h-0.5 w-3 rotate-45",
                    variant === "default" || variant === "warning" ? "bg-text-secondary" : "bg-white",
                  )}
                />
                <View
                  className={cn(
                    "-rotate-45 absolute h-0.5 w-3",
                    variant === "default" || variant === "warning" ? "bg-text-secondary" : "bg-white",
                  )}
                />
              </View>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    );
  },
);

// Toast Manager Component
const ToastManager = memo(
  forwardRef<ToastRef>((_, ref) => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const show = (toast: Omit<ToastData, "id">) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: ToastData = { ...toast, id };

      setToasts((prev) => [...prev, newToast]);
    };

    const hide = (id: string) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const hideAll = () => {
      setToasts([]);
    };

    useImperativeHandle(ref, () => ({
      show,
      hide,
      hideAll,
    }));

    return (
      <>
        {toasts.map((toast, index) => (
          <Toast key={toast.id} {...toast} index={index} onDismiss={hide} />
        ))}
      </>
    );
  }),
);

// Hook for using toast
let toastRef: React.RefObject<ToastRef | null> | null = null;

export const useToast = () => {
  const show = (toast: Omit<ToastData, "id">) => {
    toastRef?.current?.show(toast);
  };

  const hide = (id: string) => {
    toastRef?.current?.hide(id);
  };

  const hideAll = () => {
    toastRef?.current?.hideAll();
  };

  const success = (title: string, description?: string) => {
    show({ title, description, variant: "success" });
  };

  const error = (title: string, description?: string) => {
    show({ title, description, variant: "error" });
  };

  const warning = (title: string, description?: string) => {
    show({ title, description, variant: "warning" });
  };

  const info = (title: string, description?: string) => {
    show({ title, description, variant: "info" });
  };

  return {
    show,
    hide,
    hideAll,
    success,
    error,
    warning,
    info,
  };
};

// Provider component to be used at app root
export const ToastProvider = memo<{ children: React.ReactNode }>(({ children }) => {
  const ref = useRef<ToastRef>(null);

  useEffect(() => {
    toastRef = ref;
    return () => {
      toastRef = null;
    };
  }, []);

  return (
    <>
      {children}
      <ToastManager ref={ref} />
    </>
  );
});

Toast.displayName = "Toast";
ToastManager.displayName = "ToastManager";
ToastProvider.displayName = "ToastProvider";

export { Toast, ToastManager, type ToastRef };
