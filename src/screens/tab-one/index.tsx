import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

import { SafeAreaView } from "@/components/styled/safe-area-view";
import { Text } from "@/components/ui/text";

export function TabOneScreen() {
  const { t } = useTranslation("screens");

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1" contentContainerClassName="pb-8" showsVerticalScrollIndicator={false}>
        <View className="mb-6 px-4 pt-4">
          <Text variant="h4">{t("tab1.title")}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
