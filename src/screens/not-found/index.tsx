import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export function NotFoundScreen() {
  const { t } = useTranslation("screens");

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t("notFound.message")}</Text>
      <Pressable onPress={() => router.replace("/")} style={styles.link}>
        <Text style={styles.linkText}>{t("notFound.goHome")}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing[5],
    backgroundColor: theme.colors.background.primary,
  },
  text: {
    color: theme.colors.text.primary,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    color: theme.colors.interactive.primary,
  },
}));
