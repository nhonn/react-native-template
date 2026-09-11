import { Pressable, StyleSheet, Text, View } from "react-native";

import { resetToTabs } from "@/navigation/navigation-ref";

export function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text>This screen does not exist.</Text>
      <Pressable onPress={resetToTabs} style={styles.link}>
        <Text>Go to home screen!</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
