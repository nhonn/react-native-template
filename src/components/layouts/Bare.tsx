import { type FC, memo } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useThemeColors } from "@/theme/hooks/useTheme";
import type { BareLayoutProps } from "./types";

const BareLayoutComponent: FC<BareLayoutProps> = ({ children, contentContainerStyle, safeAreaEdges = ["top"] }) => {
  const colors = useThemeColors();
  return (
    <SafeAreaView edges={safeAreaEdges} style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <View
        style={[
          { flex: 1, backgroundColor: colors.background.primary, paddingHorizontal: 16, paddingVertical: 8 },
          contentContainerStyle,
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
};

export const BareLayout = memo(BareLayoutComponent);

BareLayout.displayName = "BareLayout";
