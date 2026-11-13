import { View } from "@tamagui/tailwind";
import type { FC } from "react";

import { SafeScreen } from "./safe-screen";
import type { BareLayoutProps } from "./types";

export const BareLayout: FC<BareLayoutProps> = ({ children, contentContainerStyle, safeAreaEdges = ["top"] }) => {
  return (
    <SafeScreen edges={safeAreaEdges}>
      <View className="flex-1 bg-background-primary px-4 py-2" style={contentContainerStyle}>
        {children}
      </View>
    </SafeScreen>
  );
};

BareLayout.displayName = "BareLayout";
