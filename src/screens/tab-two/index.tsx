import { Button, Host, TextInput, useNativeState, type TextInputRef } from "@expo/ui";
import { Text, View } from "@tamagui/tailwind";
import { useBottomTabBarHeight } from "expo-router/tabs";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getTokenValue } from "tamagui";

import { LegendList } from "@/components/common/legend-list";
import { Toast } from "@/components/common/toast";
import { useTheme } from "@/theme/hooks/useTheme";

import { useNotes } from "./useNotes";

const LIST_CONTENT_STYLE = { padding: getTokenValue("$3", "space") };
const INPUT_HOST_STYLE = { flex: 1 };

export function TabTwoScreen() {
  const { t } = useTranslation("screens");
  const { isDark } = useTheme();
  const { notes, addNote } = useNotes();
  const draft = useNativeState("");
  const inputRef = useRef<TextInputRef>(null);
  const tabBarHeight = useBottomTabBarHeight();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const hideToast = useCallback(() => setToastMessage(null), []);

  const handleAdd = async () => {
    const title = draft.value.trim();
    if (!title) {
      return;
    }
    const saved = await addNote(title);
    if (saved) {
      inputRef.current?.clear();
    }
    setToastMessage(saved ? t("tab2.added") : t("tab2.addFailed"));
  };

  return (
    <View className="flex-1 bg-background-primary">
      <Text className="p-4 pb-0 text-text-secondary">{t("tab2.subtitle")}</Text>
      <View className="flex-row items-center gap-2 p-4">
        <Host matchContents={{ vertical: true }} colorScheme={isDark ? "dark" : "light"} style={INPUT_HOST_STYLE}>
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
          <View className="mb-2 rounded-lg bg-surface-elevated p-4">
            <Text className="text-[16px] font-medium text-text-primary">{item.title}</Text>
          </View>
        )}
        ListEmptyComponent={<Text className="p-4 text-center text-text-secondary">{t("tab2.empty")}</Text>}
        estimatedItemSize={56}
        contentContainerStyle={LIST_CONTENT_STYLE}
      />
      <Toast
        message={toastMessage ?? ""}
        offsetBottom={tabBarHeight}
        onHide={hideToast}
        visible={toastMessage !== null}
      />
    </View>
  );
}
