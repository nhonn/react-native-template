import { Typography } from "heroui-native/text";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

import { SafeAreaView } from "@/components/styled/safe-area-view";

export function TabOneScreen() {
  const { t } = useTranslation("screens");

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1" contentContainerClassName="pb-8" showsVerticalScrollIndicator={false}>
        <View className="mb-6 px-4 pt-4">
          <Typography type="h4">{t("tab1.title")}</Typography>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
