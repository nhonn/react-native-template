import { Button, Host, Icon, Text } from "@expo/ui";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

import { useTheme } from "@/theme/hooks/useTheme";
import type { ModalLayoutProps } from "./types";

const CLOSE_ICON = Icon.select({
  ios: "xmark",
  android: import("@expo/material-symbols/close.xml"),
});

export const ModalLayout: FC<ModalLayoutProps> = ({ title, children }) => {
  const navigation = useNavigation();
  const { isDark } = useTheme();

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        {title ? (
          <Host colorScheme={isDark ? "dark" : "light"} matchContents>
            <Text textStyle={{ fontSize: 20, fontWeight: "600" }}>{title}</Text>
          </Host>
        ) : null}
        <Host colorScheme={isDark ? "dark" : "light"} matchContents>
          <Button onPress={handleClose} variant="text">
            <Icon name={CLOSE_ICON} size={24} />
          </Button>
        </Host>
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
