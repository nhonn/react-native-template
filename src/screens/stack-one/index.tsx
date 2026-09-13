import { Button, Column, Host, Text } from "@expo/ui";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Layout } from "@/components/layouts";
import type { RootStackParamList } from "@/navigation/types";
import { useTheme } from "@/theme/hooks/useTheme";

type StackOneNavigation = NativeStackNavigationProp<RootStackParamList, "Stack1">;

export function StackOneScreen() {
  const { t } = useTranslation("screens");
  const navigation = useNavigation<StackOneNavigation>();
  const { isDark } = useTheme();
  const [count, setCount] = useState(0);

  return (
    <Layout.Base title={t("stack1.title")}>
      <View style={styles.content}>
        <Host colorScheme={isDark ? "dark" : "light"} matchContents>
          <Column spacing={16}>
            <Text>{t("stack1.subtitle")}</Text>
            <Text textStyle={{ fontSize: 32, fontWeight: "700" }}>{t("stack1.counter", { count })}</Text>
            <Button label={t("stack1.increment")} onPress={() => setCount((value) => value + 1)} />
            <Button label={t("stack1.openModal")} variant="outlined" onPress={() => navigation.navigate("Modal1")} />
          </Column>
        </Host>
      </View>
    </Layout.Base>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface.primary,
  },
}));
