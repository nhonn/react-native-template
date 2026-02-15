import { useRouter } from "expo-router";
import { X } from "lucide-react-native";
import { type FC, memo } from "react";
import { Pressable, View } from "react-native";

import { Typography } from "@/components/common";
import { SafeAreaView } from "@/components/styled/SafeAreaView";
import type { ModalLayoutProps } from "./types";

const ModalLayoutComponent: FC<ModalLayoutProps> = ({ title, children }) => {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-4 py-2 pb-2 lg:px-8 lg:py-2">
      <View className="flex-row items-center justify-between py-4">
        <Typography variant="h4">{title}</Typography>
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
