import { BottomSheet, Button, Column, Host, Text } from "@expo/ui";
import { View } from "@tamagui/tailwind";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Layout } from "@/components/layouts";
import { useTheme } from "@/theme/hooks/useTheme";

export function ModalOneScreen() {
  const { t } = useTranslation("screens");
  const { isDark } = useTheme();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <Layout.Modal title={t("modal1.title")}>
        <View className="flex-1 items-center justify-center bg-background-primary">
          <Host colorScheme={isDark ? "dark" : "light"} matchContents>
            <Column spacing={16}>
              <Text>{t("modal1.subtitle")}</Text>
              <Button label={t("modal1.openSheet")} variant="outlined" onPress={() => setSheetOpen(true)} />
            </Column>
          </Host>
        </View>
      </Layout.Modal>
      <BottomSheet isPresented={sheetOpen} onDismiss={() => setSheetOpen(false)}>
        <Column spacing={12} style={{ padding: 24 }}>
          <Text textStyle={{ fontSize: 17, fontWeight: "600" }}>{t("modal1.sheet.title")}</Text>
          <Text>{t("modal1.sheet.body")}</Text>
        </Column>
      </BottomSheet>
    </>
  );
}
