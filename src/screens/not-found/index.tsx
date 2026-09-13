import { Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { resetToTabs } from "@/navigation/navigation-ref";

export function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This screen does not exist.</Text>
      <Pressable onPress={resetToTabs} style={styles.link}>
        <Text style={styles.linkText}>Go to home screen!</Text>
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
