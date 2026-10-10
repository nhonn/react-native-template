import { wrap } from "@sentry/react-native";
import { Stack, ThemeProvider } from "expo-router";
import { hideAsync, preventAutoHideAsync } from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

import { initializeI18n } from "@/i18n";
import { settings$ } from "@/stores/settings";
import { MainProvider } from "@/providers/MainProvider";
import { useTheme } from "@/theme/hooks/useTheme";
import { createNavigationTheme } from "@/theme/navigation";
import { initializeUnistylesTheme } from "@/theme/stores/useThemeStore";
import { logger } from "@/utils/logger";
import { initializeRevenueCat } from "@/utils/revenuecat";
import { captureException, initSentry } from "@/utils/sentry";

// Run once at module scope so crash reporting and the splash hold are in place
// before the first render.
initSentry();
preventAutoHideAsync().catch((error: unknown) => {
  logger.warn("Failed to prevent splash screen auto-hide:", error);
});

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
  const { t } = useTranslation("screens");
  const { theme } = useTheme();
  const navigationTheme = useMemo(() => createNavigationTheme(theme), [theme]);

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
            <Stack.Screen name="+not-found" options={{ title: t("notFound.title") }} />
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
        initializeUnistylesTheme();
        const [language] = await Promise.all([initializeI18n(), initializeRevenueCat()]);
        settings$.language.set(language);
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
