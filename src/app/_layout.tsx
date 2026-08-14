import { captureException, wrap } from "@sentry/react-native";
import { useSegments } from "expo-router";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router/react-navigation";
import { Stack } from "expo-router/stack";
import { hideAsync } from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { initializeI18n } from "@/i18n";
import { MainProvider } from "@/providers/MainProvider";
import { useTheme } from "@/theme/hooks/useTheme";
import { getScreenNameFromSegments, shouldTrackScreenView, trackScreenView } from "@/utils/analytics";
import { logger } from "@/utils/logger";
import { initializeRevenueCat } from "@/utils/revenuecat";
import { initSentry } from "@/utils/sentry";
import { initializeSplashScreen } from "@/utils/splashScreen";
import "../global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

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
  const { isDark } = useTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MainProvider>
        <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
          <AnalyticsScreenTracker />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(stacks)" options={{ headerShown: false }} />
            <Stack.Screen name="(modals)" options={{ headerShown: false, presentation: "modal" }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
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
        await Promise.all([initializeI18n(), initializeRevenueCat()]);
      } catch (error) {
        logger.error("Root initialization failed:", error);
        captureException(error);
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

export default wrap(RootLayout);
