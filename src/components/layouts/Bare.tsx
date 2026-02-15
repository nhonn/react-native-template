import { type FC, memo } from "react";
import { View } from "react-native";

import { SafeAreaView } from "@/components/styled/SafeAreaView";
import type { BareLayoutProps } from "./types";

const BareLayoutComponent: FC<BareLayoutProps> = ({ children, contentContainerStyle, safeAreaEdges = ["top"] }) => {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={safeAreaEdges}>
      <View className="flex-1 bg-background px-4 py-2" style={contentContainerStyle}>
        {children}
      </View>
    </SafeAreaView>
  );
};

export const BareLayout = memo(BareLayoutComponent);

BareLayout.displayName = "BareLayout";
