import { Button, Host, TextInput, useNativeState, type TextInputRef } from "@expo/ui";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Text as RNText, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { LegendList } from "@/components/common/legend-list";
import { useTheme } from "@/theme/hooks/useTheme";

import { useNotes } from "./useNotes";

export function TabTwoScreen() {
  const { t } = useTranslation("screens");
  const { isDark } = useTheme();
  const { notes, addNote } = useNotes();
  const draft = useNativeState("");
  const inputRef = useRef<TextInputRef>(null);

  const handleAdd = () => {
    void addNote(draft.value);
    inputRef.current?.clear();
  };

  return (
    <View style={styles.root}>
      <RNText style={styles.subtitle}>{t("tab2.subtitle")}</RNText>
      <View style={styles.form}>
        <Host matchContents={{ vertical: true }} colorScheme={isDark ? "dark" : "light"} style={styles.input}>
          <TextInput ref={inputRef} value={draft} placeholder={t("tab2.placeholder")} />
        </Host>
        <Host matchContents colorScheme={isDark ? "dark" : "light"}>
          <Button label={t("tab2.add")} onPress={handleAdd} />
        </Host>
      </View>
      <LegendList
        data={notes}
        keyExtractor={(note) => note.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <RNText style={styles.itemText}>{item.title}</RNText>
          </View>
        )}
        ListEmptyComponent={<RNText style={styles.empty}>{t("tab2.empty")}</RNText>}
        estimatedItemSize={56}
        contentContainerStyle={styles.content}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  root: { flex: 1, backgroundColor: theme.colors.background.primary },
  subtitle: { color: theme.colors.text.secondary, padding: theme.spacing[4], paddingBottom: 0 },
  form: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing[2],
    padding: theme.spacing[4],
  },
  input: { flex: 1 },
  content: { padding: theme.spacing[3] },
  item: {
    padding: theme.spacing[4],
    marginBottom: theme.spacing[2],
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface.elevated,
  },
  itemText: { color: theme.colors.text.primary, fontSize: 16, fontWeight: "500" },
  empty: { color: theme.colors.text.secondary, textAlign: "center", padding: theme.spacing[4] },
}));
