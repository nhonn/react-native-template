import type { FC } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

import type { BareLayoutProps } from "./types";

export const BareLayout: FC<BareLayoutProps> = ({ children, contentContainerStyle, safeAreaEdges = ["top"] }) => {
  return (
    <SafeAreaView edges={safeAreaEdges} style={styles.root}>
      <View style={[styles.content, contentContainerStyle]}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create((theme) => ({
  root: { flex: 1, backgroundColor: theme.colors.background.primary },
  content: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
  },
}));

BareLayout.displayName = "BareLayout";
