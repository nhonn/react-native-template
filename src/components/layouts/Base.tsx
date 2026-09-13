import { Button, Host, Icon, Text } from "@expo/ui";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

import { resetToTabs } from "@/navigation/navigation-ref";
import { useTheme } from "@/theme/hooks/useTheme";
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
  const { isDark, theme } = useTheme();

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
    <SafeAreaView edges={safeAreaEdges} style={styles.root}>
      <View style={styles.flex}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {showBack ? (
              <Host colorScheme={isDark ? "dark" : "light"} matchContents>
                <Button onPress={handleBack} variant="text">
                  <Icon color={theme.colors.text.inverse} name={BACK_ICON} size={24} />
                </Button>
              </Host>
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
