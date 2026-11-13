import { Text, View } from "@tamagui/tailwind";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";

export function NotFoundScreen() {
  const { t } = useTranslation("screens");

  return (
    <View className="flex-1 items-center justify-center bg-background-primary p-5">
      <Text className="text-text-primary">{t("notFound.message")}</Text>
      <Pressable onPress={() => router.replace("/")}>
        <View className="mt-[15px] py-[15px]">
          <Text className="text-interactive-primary">{t("notFound.goHome")}</Text>
        </View>
      </Pressable>
    </View>
  );
}
