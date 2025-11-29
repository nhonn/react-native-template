import { useRouter } from "expo-router";
import { X } from "lucide-react-native";
import { type FC, memo } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "@/components/styled/SafeAreaView";

import { ResponsiveText } from "../common/ResponsiveText";
import type { ModalLayoutProps } from "./types";

const ModalLayoutComponent: FC<ModalLayoutProps> = ({ title, children }) => {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light px-4 py-2 pb-2 lg:px-8 lg:py-2 dark:bg-background-dark">
      <View className="flex-row items-center justify-between py-4">
        <ResponsiveText preset="h4">{title}</ResponsiveText>
        <Pressable className="px-4" onPress={handleClose}>
          <X />
        </Pressable>
      </View>
      {children}
    </SafeAreaView>
  );
};

export const ModalLayout = memo(ModalLayoutComponent);
