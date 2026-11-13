import { Column, Host, Row, Switch, Text } from "@expo/ui";
import { Text as TwText, View } from "@tamagui/tailwind";
import { useTranslation } from "react-i18next";

import { useTheme } from "@/theme/hooks/useTheme";

import { PulseCanvas } from "./pulse-canvas";

export function TabOneScreen() {
  const { t } = useTranslation("screens");
  const { isDark, setMode } = useTheme();

  const handleModeChange = (value: boolean) => {
    setMode(value ? "dark" : "light");
  };

  return (
    <View className="flex-1 bg-background-primary">
      <Host colorScheme={isDark ? "dark" : "light"} matchContents={{ vertical: true }}>
        <Column spacing={16} style={{ padding: 16 }}>
          <Text textStyle={{ fontSize: 20, fontWeight: "600" }}>{t("tab1.title")}</Text>
          <Text>{t("tab1.subtitle")}</Text>
          <Row alignment="center" spacing={12}>
            <Text>{t("tab1.darkMode")}</Text>
            <Switch value={isDark} onValueChange={handleModeChange} />
          </Row>
        </Column>
      </Host>
      <PulseCanvas />
      <View className="m-4 gap-1 rounded-lg bg-surface-elevated p-4">
        <TwText className="text-[16px] font-semibold text-text-primary">{t("tab1.cardTitle")}</TwText>
        <TwText className="text-text-secondary">{t("tab1.cardBody")}</TwText>
      </View>
    </View>
  );
}
