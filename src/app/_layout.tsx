import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { initializeI18n } from "@/i18n";
import { MainProvider } from "@/providers/MainProvider";
import { initAnalytics } from "@/utils/analytics";
import { initializeRevenueCat } from "@/utils/revenuecat";
import "../global.css";

let isInitialized = false;

if (!isInitialized) {
  Promise.all([initializeI18n(), initAnalytics(), initializeRevenueCat()]).then(() => {
    isInitialized = true;
  });
}

function AppContent() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MainProvider>
        <Stack initialRouteName="(tabs)">
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(stacks)" options={{ headerShown: false }} />
          <Stack.Screen name="(modals)" options={{ headerShown: false, presentation: "modal" }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </MainProvider>
    </GestureHandlerRootView>
  );
}

function RootLayout() {
  return <AppContent />;
}

export default RootLayout;
