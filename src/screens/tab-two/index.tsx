import { Column, Host, ScrollView, Text } from "@expo/ui";
import { useTranslation } from "react-i18next";

import { useTheme } from "@/theme/hooks/useTheme";

export function TabTwoScreen() {
  const { t } = useTranslation("screens");
  const { isDark } = useTheme();

  return (
    <Host colorScheme={isDark ? "dark" : "light"} style={{ flex: 1 }}>
      <ScrollView showsIndicators={false}>
        <Column style={{ padding: 16 }}>
          <Text textStyle={{ fontSize: 20, fontWeight: "600" }}>{t("tab2.title")}</Text>
        </Column>
      </ScrollView>
    </Host>
  );
}
