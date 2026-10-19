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
    <SafeAreaView edges={safeAreaEdges} style={styles.root}>
      <View style={styles.flex}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
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
        <View style={[styles.body, contentContainerStyle]}>{children}</View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create((theme) => ({
  root: { flex: 1, backgroundColor: theme.colors.background.primary },
  flex: { flex: 1, backgroundColor: theme.colors.surface.primary },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing[3],
    backgroundColor: theme.colors.interactive.primary,
  },
  headerLeft: { maxWidth: "60%", flexDirection: "row", alignItems: "center", gap: theme.spacing[2] },
  body: { flex: 1, padding: theme.spacing[3], backgroundColor: theme.colors.surface.primary },
}));

BaseLayout.displayName = "BaseLayout";
