import { Button, Host, Icon, Text } from "@expo/ui";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { resetToTabs } from "@/navigation/navigation-ref";
import { useTheme, useThemeColors } from "@/theme/hooks/useTheme";
import type { BaseLayoutProps } from "./types";

const BACK_ICON = Icon.select({
  ios: "chevron.left",
  android: import("@expo/material-symbols/arrow_back.xml"),
});

export const BaseLayout: FC<BaseLayoutProps> = ({
  title,
  showBack = true,
  onBack,
  children,
  contentContainerStyle,
  safeAreaEdges = ["top"],
  callToAction,
}) => {
  const navigation = useNavigation();
  const colors = useThemeColors();
  const { isDark } = useTheme();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      resetToTabs();
    }
  };

  return (
    <SafeAreaView edges={safeAreaEdges} style={[styles.root, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.flex, { backgroundColor: colors.surface.primary }]}>
        <View style={[styles.header, { backgroundColor: colors.interactive.primary }]}>
          <View style={styles.headerLeft}>
            {showBack ? (
              <Host colorScheme={isDark ? "dark" : "light"} matchContents>
                <Button onPress={handleBack} variant="text">
                  <Icon color="#FFFFFF" name={BACK_ICON} size={24} />
                </Button>
              </Host>
            ) : null}
            {title ? (
              <Host colorScheme={isDark ? "dark" : "light"} matchContents>
                <Text textStyle={{ color: "#FFFFFF", fontSize: 16, fontWeight: "500" }}>{title}</Text>
              </Host>
            ) : null}
          </View>
          {callToAction}
        </View>
        <View style={[styles.body, { backgroundColor: colors.surface.primary }, contentContainerStyle]}>
          {children}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  headerLeft: { maxWidth: "60%", flexDirection: "row", alignItems: "center", gap: 8 },
  body: { flex: 1, padding: 12 },
});

BaseLayout.displayName = "BaseLayout";
