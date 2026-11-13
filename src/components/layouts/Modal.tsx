import { Host, Text } from "@expo/ui";
import { View } from "@tamagui/tailwind";
import { useRouter } from "expo-router";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "@/components/common/icon";
import { IconButton } from "@/components/common/icon-button";
import { useTheme } from "@/theme/hooks/useTheme";
import { SafeScreen } from "./safe-screen";
import type { ModalLayoutProps } from "./types";

export const ModalLayout: FC<ModalLayoutProps> = ({ title, children }) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { isDark, theme } = useTheme();

  const handleClose = () => {
    router.back();
  };

  return (
    <SafeScreen className="px-4 py-2">
      <View className="flex-row items-center justify-between py-4">
        {title ? (
          <Host colorScheme={isDark ? "dark" : "light"} matchContents>
            <Text textStyle={{ fontSize: 20, fontWeight: "600" }}>{title}</Text>
          </Host>
        ) : null}
        <IconButton accessibilityLabel={t("close")} onPress={handleClose}>
          <Icon
            accessibilityElementsHidden
            color={theme.colors.text.primary}
            importantForAccessibility="no-hide-descendants"
            name="x"
            size={24}
          />
        </IconButton>
      </View>
      {children}
    </SafeScreen>
  );
};

ModalLayout.displayName = "ModalLayout";
