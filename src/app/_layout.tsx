import { Stack } from "expo-router";
import { hideAsync, preventAutoHideAsync } from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { useTheme } from "@/hooks/useTheme";
import { initializeI18n } from "@/i18n";
import { MainProvider } from "@/providers/MainProvider";
import { logger } from "@/utils/logger";
import "../global.css";

// Prevent the splash screen from auto-hiding before asset loading is complete
preventAutoHideAsync();

// Initialize critical services immediately (don't wait)
const initPromise = Promise.all([initializeI18n()]);

interface AppState {
  fonts: boolean;
  database: boolean;
  theme: boolean;
  error: string | null;
}

function AppContent() {
  const { theme } = useTheme();
  const splashHiddenRef = useRef(false);

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
      database: appState.database,
      theme: !!theme,
      error: appState.error,
    };

    // Optimized check: reduce strictness for faster startup
    const themeReady = !!theme; // Simple theme check
    const isReady = themeReady && !currentState.error && !isInitializing;

    if (isReady) {
      try {
        // Reduced delay for faster startup
        await new Promise((resolve) => setTimeout(resolve, 50));

        await hideAsync();
        splashHiddenRef.current = true;
      } catch (_) {
        logger.error("Failed to hide splash screen");
      }
    }
  }, [appState, theme, isInitializing]);

  // Parallel initialization on mount
  useEffect(() => {
    // Wait for critical services, then start database
    initPromise.finally(() => {
      setIsInitializing(true);
    });
  }, []);

  useEffect(() => {
    // Faster theme ready check
    const themeReady = !!theme;
    setAppState((prev) => ({ ...prev, theme: themeReady }));
  }, [theme]);

  // Check readiness immediately when conditions change
  useEffect(() => {
    checkAndHideSplash();
  }, [checkAndHideSplash]);

  // Reduced timeout for faster fallback
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!splashHiddenRef.current) {
        hideAsync();
        splashHiddenRef.current = true;
      }
    }, 8000); // Reduced from 15 to 8 seconds

    return () => clearTimeout(timeout);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MainProvider>
        <Stack initialRouteName="(tabs)">
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(stacks)" options={{ headerShown: false }} />
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
