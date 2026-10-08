import { wrap } from "@sentry/react-native";
import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { hideAsync } from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

import { initializeI18n } from "@/i18n";
import { MainProvider } from "@/providers/MainProvider";
import { useTheme } from "@/theme/hooks/useTheme";
import { createNavigationTheme } from "@/theme/navigation";
import { initializeUnistylesTheme } from "@/theme/stores/useThemeStore";
import { logger } from "@/utils/logger";
import { initializeRevenueCat } from "@/utils/revenuecat";
import { initSentry, captureException } from "@/utils/sentry";
import { initializeSplashScreen } from "@/utils/splashScreen";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

const styles = StyleSheet.create({
  root: { flex: 1 },
});

function RootLayoutNav() {
  const { theme } = useTheme();
  const navigationTheme = createNavigationTheme(theme);

  return (
    <GestureHandlerRootView style={styles.root}>
      <MainProvider>
        <ThemeProvider value={navigationTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="stack-one" options={{ headerShown: false, animation: "slide_from_right" }} />
            <Stack.Screen
              name="modal-one"
              options={{
                headerShown: false,
                presentation: "modal",
                animation: "slide_from_bottom",
              }}
            />
            <Stack.Screen name="+not-found" options={{ title: "Oops!" }} />
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
        initializeUnistylesTheme();
        await initializeSplashScreen();
        await Promise.all([initializeI18n(), initializeRevenueCat()]);
      } catch (error) {
        logger.error("Root initialization failed:", error);
        captureException(error);
      }
      setReady(true);
      await hideAsync();
    })();
  }, []);

  if (!ready) {
    return null;
  }

  return <RootLayoutNav />;
}

export default wrap(RootLayout);
