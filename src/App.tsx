import { captureException, wrap } from "@sentry/react-native";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { hideAsync } from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

import { initializeI18n } from "@/i18n";
import { RootStack } from "@/navigation";
import { linking } from "@/navigation/linking";
import { navigationRef } from "@/navigation/navigation-ref";
import { MainProvider } from "@/providers/MainProvider";
import { useTheme } from "@/theme/hooks/useTheme";
import { initializeUnistylesTheme } from "@/theme/stores/useThemeStore";
import { logger } from "@/utils/logger";
import { initializeRevenueCat } from "@/utils/revenuecat";
import { initSentry } from "@/utils/sentry";
import { initializeSplashScreen } from "@/utils/splashScreen";

const styles = StyleSheet.create({
  root: { flex: 1 },
});

function AppContent() {
  const { isDark } = useTheme();

  return (
    <GestureHandlerRootView style={styles.root}>
      <MainProvider>
        <NavigationContainer ref={navigationRef} theme={isDark ? DarkTheme : DefaultTheme} linking={linking}>
          <RootStack />
          <StatusBar style="auto" />
        </NavigationContainer>
      </MainProvider>
    </GestureHandlerRootView>
  );
}

function App() {
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

  return <AppContent />;
}

export default wrap(App);
