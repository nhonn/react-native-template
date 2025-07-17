import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { type FC, memo, useCallback } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Heading } from "@/components/common/Heading";
import { iconProps } from "@/constants/styles";
import { uiLogger } from "@/utils/logger";
import type { BaseLayoutProps } from "./types";

const backIcon = <ChevronLeft {...iconProps.lg} color="white" />;

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
      } catch (error) {
        uiLogger.error("Error navigating back", error);
        // Fallback to home if back navigation fails
        router.replace("/(tabs)");
      }
    }
  }, [onBack, router]);

  return (
    <SafeAreaView className="flex-1 bg-theme" edges={safeAreaEdges}>
      <View className="flex-1 bg-background-light dark:bg-background-dark">
        <View className="w-full flex-row items-center justify-between bg-theme p-3">
          <View className="max-w-[60%] flex-row items-center gap-2">
            {showBack && <Pressable onPress={handleBack}>{backIcon}</Pressable>}
            <Heading.PageTitle value={title || ""} />
          </View>
          {callToAction}
        </View>
        <View className="flex-1 bg-background-light p-3 dark:bg-background-dark" style={contentContainerStyle}>
          {children}
        </View>
      </View>
    </SafeAreaView>
  );
};

export const BaseLayout = memo(BaseLayoutComponent);

BaseLayout.displayName = "BaseLayout";
