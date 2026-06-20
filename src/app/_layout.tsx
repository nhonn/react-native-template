import * as Sentry from "@sentry/react-native";
import { Stack, useSegments } from "expo-router";
import { hideAsync } from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { initializeI18n } from "@/i18n";
import { MainProvider } from "@/providers/MainProvider";
import { initializeAdapty } from "@/utils/adapty";
import { getScreenNameFromSegments, shouldTrackScreenView, trackScreenView } from "@/utils/analytics";
import { logger } from "@/utils/logger";
import { initSentry } from "@/utils/sentry";
import { initializeSplashScreen } from "@/utils/splashScreen";
import "../global.css";

function AnalyticsScreenTracker() {
  const segments = useSegments();
  const lastTrackedScreenRef = useRef<string | null>(null);

  useEffect(() => {
    const screenName = getScreenNameFromSegments(segments);

    if (!shouldTrackScreenView(lastTrackedScreenRef.current, screenName)) {
      return;
    }

    lastTrackedScreenRef.current = screenName;
    trackScreenView(screenName);
  }, [segments]);

  return null;
}

function AppContent() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MainProvider>
        <AnalyticsScreenTracker />
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
        initSentry();
        await initializeSplashScreen();
        await Promise.all([initializeI18n(), initializeAdapty()]);
      } catch (error) {
        logger.error("Root initialization failed:", error);
        Sentry.captureException(error);
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

export default Sentry.wrap(RootLayout);
