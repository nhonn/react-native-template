import { Host, Text } from "@expo/ui";
import { View } from "@tamagui/tailwind";
import { useRouter } from "expo-router";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "@/components/common/icon";
import { IconButton } from "@/components/common/icon-button";
import { useTheme } from "@/theme/hooks/useTheme";
import { SafeScreen } from "./safe-screen";
import type { BaseLayoutProps } from "./types";

export const BaseLayout: FC<BaseLayoutProps> = ({
  title,
  showBack = true,
  onBack,
  children,
  contentContainerStyle,
  safeAreaEdges = ["top"],
  callToAction,
}) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { isDark, theme } = useTheme();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  return (
    <SafeScreen edges={safeAreaEdges}>
      <View className="flex-1 bg-surface-primary">
        <View className="w-full flex-row items-center justify-between bg-interactive-primary p-3">
          <View className="max-w-[60%] flex-row items-center gap-2">
            {showBack ? (
              <IconButton accessibilityLabel={t("back")} onPress={handleBack}>
                <Icon
                  accessibilityElementsHidden
                  color={theme.colors.text.inverse}
                  importantForAccessibility="no-hide-descendants"
                  name="chevron-left"
                  size={24}
                />
              </IconButton>
            ) : null}
            {title ? (
              <Host colorScheme={isDark ? "dark" : "light"} matchContents>
                <Text textStyle={{ color: theme.colors.text.inverse, fontSize: 16, fontWeight: "500" }}>{title}</Text>
              </Host>
            ) : null}
          </View>
          {callToAction}
        </View>
        <View className="flex-1 bg-surface-primary p-3" style={contentContainerStyle}>
          {children}
        </View>
      </View>
    </SafeScreen>
  );
};

BaseLayout.displayName = "BaseLayout";
