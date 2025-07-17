import { wrap } from "@sentry/react-native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { hideAsync, preventAutoHideAsync } from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { useTheme } from "@/hooks/useTheme";
import { initializeI18n } from "@/i18n";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { initAnalytics } from "@/utils/analytics";
import { dbLogger } from "@/utils/logger";
import { initSentry } from "@/utils/sentry";
import "../global.css";

// Prevent the splash screen from auto-hiding before asset loading is complete
preventAutoHideAsync();

// Initialize critical services immediately (don't wait)
const initPromise = Promise.all([initSentry(), initializeI18n(), initAnalytics()]).catch((error) => {
  dbLogger.error("Failed to initialize services:", error);
});

interface AppState {
  fonts: boolean;
  database: boolean;
  theme: boolean;
  error: string | null;
}

function AppContent() {
  const { isThemeLoaded, colors } = useTheme();
  const splashHiddenRef = useRef(false);

  // Start font loading immediately
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [appState, setAppState] = useState<AppState>({
    fonts: false,
    database: false,
    theme: false,
    error: null,
  });

  const [isInitializing, setIsInitializing] = useState(false);

  // Optimized app readiness check with minimal delay
  const checkAndHideSplash = useCallback(async () => {
    if (splashHiddenRef.current) {
      return;
    }

    const currentState = {
      fonts: loaded,
      database: appState.database,
      theme: isThemeLoaded,
      error: appState.error,
    };

    // Optimized check: reduce strictness for faster startup
    const themeReady = isThemeLoaded && colors; // Don't wait for theme string
    const isReady = currentState.fonts && currentState.database && themeReady && !currentState.error && !isInitializing;

    dbLogger.info("App readiness:", {
      ...currentState,
      themeReady,
      isReady,
    });

    if (isReady) {
      try {
        // Reduced delay for faster startup
        await new Promise((resolve) => setTimeout(resolve, 50));

        await hideAsync();
        splashHiddenRef.current = true;
        dbLogger.info("Splash hidden - app ready");
      } catch (error) {
        dbLogger.error("Failed to hide splash screen:", error);
      }
    }
  }, [loaded, appState, isThemeLoaded, colors, isInitializing]);

  // Parallel initialization on mount
  useEffect(() => {
    // Wait for critical services, then start database
    initPromise.finally(() => {
      setIsInitializing(true);
    });
  }, []);

  // Optimized state updates
  useEffect(() => {
    setAppState((prev) => ({ ...prev, fonts: loaded }));
  }, [loaded]);

  useEffect(() => {
    // Faster theme ready check
    const themeReady = isThemeLoaded && !!colors;
    setAppState((prev) => ({ ...prev, theme: themeReady }));
  }, [isThemeLoaded, colors]);

  // Check readiness immediately when conditions change
  useEffect(() => {
    checkAndHideSplash();
  }, [checkAndHideSplash]);

  // Reduced timeout for faster fallback
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!splashHiddenRef.current) {
        dbLogger.warn("Splash timeout - forcing hide after 8 seconds");
        hideAsync().catch((error) => dbLogger.error("Failed to force hide splash:", error));
        splashHiddenRef.current = true;
      }
    }, 8000); // Reduced from 15 to 8 seconds

    return () => clearTimeout(timeout);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <Stack initialRouteName="(tabs)">
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(stacks)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

function RootLayout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default wrap(RootLayout);
