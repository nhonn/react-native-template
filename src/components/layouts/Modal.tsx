import { useRouter } from "expo-router";
import { X } from "phosphor-react-native/src/icons/X";
import { type FC, memo } from "react";
import { View } from "react-native";

import { Pressable } from "@/components/common/pressable";
import { SafeAreaView } from "@/components/styled/safe-area-view";
import { Text } from "@/components/ui/text";
import type { ModalLayoutProps } from "./types";

const ModalLayoutComponent: FC<ModalLayoutProps> = ({ title, children }) => {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-4 py-2 pb-2 lg:px-8 lg:py-2">
      <View className="flex-row items-center justify-between py-4">
        <Text variant="h4">{title}</Text>
        <Pressable
          accessibilityLabel="Close"
          accessibilityRole="button"
          className="px-4"
          hitSlop={12}
          onPress={handleClose}
        >
          <X />
        </Pressable>
      </View>
      {children}
    </SafeAreaView>
  );
};

export const ModalLayout = memo(ModalLayoutComponent);

ModalLayout.displayName = "ModalLayout";
