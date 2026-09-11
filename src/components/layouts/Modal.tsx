import { Button, Host, Icon, Text } from "@expo/ui";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme, useThemeColors } from "@/theme/hooks/useTheme";
import type { ModalLayoutProps } from "./types";

const CLOSE_ICON = Icon.select({
  ios: "xmark",
  android: import("@expo/material-symbols/close.xml"),
});

export const ModalLayout: FC<ModalLayoutProps> = ({ title, children }) => {
  const navigation = useNavigation();
  const colors = useThemeColors();
  const { isDark } = useTheme();

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 16 }}
      >
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

ModalLayout.displayName = "ModalLayout";
