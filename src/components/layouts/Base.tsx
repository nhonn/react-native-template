import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { type FC, memo, useCallback } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Heading } from "@/components/common/Heading";
import type { BaseLayoutProps } from "./types";

const BackIcon = () => {
  return <ChevronLeft color="white" size={24} />;
};

const BaseLayoutComponent: FC<BaseLayoutProps> = ({
  title,
  showBack = true,
  onBack,
  children,
  contentContainerStyle,
  safeAreaEdges = ["top"],
  callToAction,
}) => {
  const router = useRouter();

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      try {
        if (router.canGoBack?.()) {
          router.back();
        } else {
          router.replace("/(tabs)");
        }
      } catch (_) {
        // Fallback to home if back navigation fails
        router.replace("/(tabs)");
      }
    }
  }, [onBack, router]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={safeAreaEdges}>
      <View className="flex-1 bg-white">
        <View className="w-full flex-row items-center justify-between bg-primary-500 p-3">
          <View className="max-w-[60%] flex-row items-center gap-2">
            {showBack && (
              <Pressable onPress={handleBack}>
                <BackIcon />
              </Pressable>
            )}
            <Heading.PageTitle value={title || ""} />
          </View>
          {callToAction}
        </View>
        <View className="flex-1 bg-white p-3" style={contentContainerStyle}>
          {children}
        </View>
      </View>
    </SafeAreaView>
  );
};

export const BaseLayout = memo(BaseLayoutComponent);

BaseLayout.displayName = "BaseLayout";
