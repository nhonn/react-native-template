import { useRouter } from "expo-router";
import { Typography } from "heroui-native/text";
import { CaretLeft } from "phosphor-react-native/src/icons/CaretLeft";
import { type FC, memo, useCallback } from "react";
import { View } from "react-native";

import { Pressable } from "@/components/common/pressable";
import { SafeAreaView } from "@/components/styled/safe-area-view";
import { useThemeColors } from "@/theme/hooks/useTheme";
import type { BaseLayoutProps } from "./types";

const BackIcon = memo<{ color: string }>(({ color }) => {
  return <CaretLeft color={color} size={24} />;
});

const BaseLayoutComponent: FC<BaseLayoutProps> = ({
  title,
  showBack = true,
  onBack,
  children,
  contentContainerStyle,
  safeAreaEdges = ["top"],
  callToAction,
}) => {
  const router = useRouter();
  const colors = useThemeColors();

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      try {
        if (router.canGoBack?.()) {
          router.back();
        } else {
          router.replace("/");
        }
      } catch (_) {
        router.replace("/");
      }
    }
  }, [onBack, router]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={safeAreaEdges}>
      <View className="flex-1 bg-surface-primary">
        <View
          className="w-full flex-row items-center justify-between p-3"
          style={{ backgroundColor: colors.interactive.primary }}
        >
          <View className="max-w-[60%] flex-row items-center gap-2">
            {showBack && (
              <Pressable onPress={handleBack}>
                <BackIcon color="white" />
              </Pressable>
            )}
            <Typography className="text-white uppercase" type="h6">
              {title}
            </Typography>
          </View>
          {callToAction}
        </View>
        <View className="flex-1 bg-surface-primary p-3" style={contentContainerStyle}>
          {children}
        </View>
      </View>
    </SafeAreaView>
  );
};

export const BaseLayout = memo(BaseLayoutComponent);

BaseLayout.displayName = "BaseLayout";
BackIcon.displayName = "BackIcon";

BaseLayout.displayName = "BaseLayout";
