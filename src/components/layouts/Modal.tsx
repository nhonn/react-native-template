import { Host, Text } from "@expo/ui";
import { useRouter } from "expo-router";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

import { Icon } from "@/components/common/icon";
import { IconButton } from "@/components/common/icon-button";
import { useTheme } from "@/theme/hooks/useTheme";
import type { ModalLayoutProps } from "./types";

export const ModalLayout: FC<ModalLayoutProps> = ({ title, children }) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { isDark, theme } = useTheme();

  const handleClose = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing[4],
  },
}));

ModalLayout.displayName = "ModalLayout";
