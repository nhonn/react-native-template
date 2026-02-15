import { Stack } from "expo-router";
import { hideAsync, preventAutoHideAsync } from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { initializeI18n } from "@/i18n";
import { MainProvider } from "@/providers/MainProvider";
import { initAnalytics } from "@/utils/analytics";
import { logger } from "@/utils/logger";
import { initializeRevenueCat } from "@/utils/revenuecat";
import "../global.css";

preventAutoHideAsync();

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
  const [ready, setReady] = useState(false);
  const didInitRef = useRef(false);

  useEffect(() => {
    if (didInitRef.current) {
      return;
    }
    didInitRef.current = true;

    (async () => {
      try {
        await Promise.all([initializeI18n(), initAnalytics(), initializeRevenueCat()]);
      } catch (error) {
        logger.error("Root initialization failed:", error);
      } finally {
        setReady(true);
        await hideAsync();
      }
    })();
  }, []);

  if (!ready) {
    return null;
  }

  return <AppContent />;
}

export default RootLayout;
