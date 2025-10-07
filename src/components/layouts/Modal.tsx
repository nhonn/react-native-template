import { useRouter } from "expo-router";
import { X } from "lucide-react-native";
import { type FC, memo } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AnalyticsScreenProvider } from "@/hooks/useAnalyticsScreen";
import { ResponsiveText } from "../common";
import type { ModalLayoutProps } from "./types";

const ModalLayoutComponent: FC<ModalLayoutProps> = ({ title, children, screenName }) => {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <AnalyticsScreenProvider screenName={screenName}>
      <SafeAreaView className="flex-1 bg-background-light px-4 py-2 pb-2 lg:px-8 lg:py-2 dark:bg-background-dark">
        <View className="flex-row items-center justify-between py-4">
          <ResponsiveText preset="h4">{title}</ResponsiveText>
          <Pressable className="px-4" onPress={handleClose}>
            <X />
          </Pressable>
        </View>
        {children}
      </SafeAreaView>
    </AnalyticsScreenProvider>
  );
};

export const ModalLayout = memo(ModalLayoutComponent);
