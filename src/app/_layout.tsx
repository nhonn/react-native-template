import { Stack, useGlobalSearchParams, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { initializeI18n } from "@/i18n";
import { MainProvider } from "@/providers/MainProvider";
import { type AnalyticsConfig, initAnalytics, trackScreenOpen } from "@/utils/analytics";
import { initializeRevenueCat } from "@/utils/revenuecat";
import "../global.css";

const analyticsConfig: AnalyticsConfig = {
  mixpanelToken: process.env.EXPO_PUBLIC_MIXPANEL_TOKEN || "",
  sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN || "",
  environment: __DEV__ ? "development" : "production",
  enableAnalytics: Boolean(process.env.EXPO_PUBLIC_MIXPANEL_TOKEN),
  enableErrorTracking: Boolean(process.env.EXPO_PUBLIC_SENTRY_DSN),
};

let isInitialized = false;

if (!isInitialized) {
  Promise.all([initializeI18n(), initAnalytics(analyticsConfig), initializeRevenueCat()]).then(() => {
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
  const pathname = usePathname();
  const params = useGlobalSearchParams();

  useEffect(() => {
    trackScreenOpen(pathname, params);
  }, [pathname, params]);

  return <AppContent />;
}

export default RootLayout;
