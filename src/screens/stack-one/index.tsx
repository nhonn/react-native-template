import { Button, Column, Host, Text } from "@expo/ui";
import { View } from "@tamagui/tailwind";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Layout } from "@/components/layouts";
import { useTheme } from "@/theme/hooks/useTheme";

export function StackOneScreen() {
  const { t } = useTranslation("screens");
  const router = useRouter();
  const { isDark } = useTheme();
  const [count, setCount] = useState(0);

  return (
    <Layout.Base title={t("stack1.title")}>
      <View className="flex-1 items-center justify-center bg-surface-primary">
        <Host colorScheme={isDark ? "dark" : "light"} matchContents>
          <Column spacing={16}>
            <Text>{t("stack1.subtitle")}</Text>
            <Text textStyle={{ fontSize: 32, fontWeight: "700" }}>{t("stack1.counter", { count })}</Text>
            <Button label={t("stack1.increment")} onPress={() => setCount((value) => value + 1)} />
            <Button label={t("stack1.openModal")} variant="outlined" onPress={() => router.push("/modal-one")} />
          </Column>
        </Host>
      </View>
    </Layout.Base>
  );
}
