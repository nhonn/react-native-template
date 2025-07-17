import { type FC, memo } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { BareLayoutProps } from "./types";

const BareLayoutComponent: FC<BareLayoutProps> = ({ children, contentContainerStyle, safeAreaEdges = ["top"] }) => {
  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark" edges={safeAreaEdges}>
      <View className="flex-1 bg-background-light px-4 py-2 dark:bg-background-dark" style={contentContainerStyle}>
        {children}
      </View>
    </SafeAreaView>
  );
};

export const BareLayout = memo(BareLayoutComponent);

BareLayout.displayName = "BareLayout";
