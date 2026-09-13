import { Column, Host, Row, Switch, Text } from "@expo/ui";
import { useTranslation } from "react-i18next";
import { Text as RNText, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { useTheme } from "@/theme/hooks/useTheme";

export function TabOneScreen() {
  const { t } = useTranslation("screens");
  const { isDark, setMode } = useTheme();

  const handleModeChange = (value: boolean) => {
    setMode(value ? "dark" : "light");
  };

  return (
    <View style={styles.root}>
      <Host colorScheme={isDark ? "dark" : "light"} style={{ flex: 1 }}>
        <Column spacing={16} style={{ padding: 16 }}>
          <Text textStyle={{ fontSize: 20, fontWeight: "600" }}>{t("tab1.title")}</Text>
          <Text>{t("tab1.subtitle")}</Text>
          <Row alignment="center" spacing={12}>
            <Text>{t("tab1.darkMode")}</Text>
            <Switch value={isDark} onValueChange={handleModeChange} />
          </Row>
        </Column>
      </Host>
      <View style={styles.card}>
        <RNText style={styles.cardTitle}>{t("tab1.cardTitle")}</RNText>
        <RNText style={styles.cardBody}>{t("tab1.cardBody")}</RNText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  root: { flex: 1, backgroundColor: theme.colors.background.primary },
  card: {
    margin: theme.spacing[4],
    marginTop: 0,
    padding: theme.spacing[4],
    gap: theme.spacing[1],
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface.elevated,
  },
  cardTitle: { color: theme.colors.text.primary, fontSize: 16, fontWeight: "600" },
  cardBody: { color: theme.colors.text.secondary },
}));
