import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Text as RNText, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { LegendList } from "@/components/common/legend-list";
import { useRefreshControl } from "@/hooks/useRefreshControl";

interface ListItem {
  id: number;
}

const createItems = (): ListItem[] => Array.from({ length: 30 }, (_, index) => ({ id: index + 1 }));

export function TabTwoScreen() {
  const { t } = useTranslation("screens");
  const [items, setItems] = useState<ListItem[]>(createItems);

  const { refreshing, onRefresh } = useRefreshControl({
    onRefresh: async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setItems(createItems());
    },
  });

  return (
    <View style={styles.root}>
      <LegendList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <RNText style={styles.itemText}>{t("tab2.item", { index: item.id })}</RNText>
          </View>
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
        estimatedItemSize={56}
        contentContainerStyle={styles.content}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  root: { flex: 1, backgroundColor: theme.colors.background.primary },
  content: { padding: theme.spacing[3] },
  item: {
    padding: theme.spacing[4],
    marginBottom: theme.spacing[2],
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface.elevated,
  },
  itemText: { color: theme.colors.text.primary, fontSize: 16, fontWeight: "500" },
}));
