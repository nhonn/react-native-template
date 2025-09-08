import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Animated, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

import { useThemeIconSizes } from "@/theme";
import { Heading } from "../common/Heading";
import type { WebViewLayoutProps } from "./types";

const BackIcon = () => {
  const iconSizes = useThemeIconSizes();
  return <ChevronLeft color="white" size={iconSizes.lg} />;
};

const WebViewLayoutComponent = ({
  title,
  showBack = true,
  onBack,
  safeAreaEdges = ["top"],
  url,
  loaderColor = "#3b82f6",
  animationDuration = 400,
  webViewProps = {},
  callToAction,
}: WebViewLayoutProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const webViewOpacity = useRef(new Animated.Value(0)).current;

  const fadeInConfig = useMemo(
    () => ({
      toValue: 1,
      duration: animationDuration * 0.75,
      useNativeDriver: true,
    }),
    [animationDuration],
  );

  const fadeOutConfig = useMemo(
    () => ({
      toValue: 0,
      duration: animationDuration,
      useNativeDriver: true,
    }),
    [animationDuration],
  );

  const loaderStyle = useMemo(
    () => ({
      opacity: fadeAnim,
    }),
    [fadeAnim],
  );

  const webViewStyle = useMemo(
    () => ({
      opacity: webViewOpacity,
    }),
    [webViewOpacity],
  );

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    Animated.parallel([
      Animated.timing(fadeAnim, fadeInConfig),
      Animated.timing(webViewOpacity, fadeOutConfig),
    ]).start();
  }, [fadeAnim, webViewOpacity, fadeInConfig, fadeOutConfig]);

  const handleLoadEnd = useCallback(() => {
    Animated.parallel([Animated.timing(fadeAnim, fadeOutConfig), Animated.timing(webViewOpacity, fadeInConfig)]).start(
      () => {
        setIsLoading(false);
      },
    );
  }, [fadeAnim, webViewOpacity, fadeInConfig, fadeOutConfig]);

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      try {
        if (router.canGoBack?.()) {
          router.back();
        } else {
          router.replace("/(tabs)");
        }
      } catch (_) {
        // Fallback to home if back navigation fails
        router.replace("/(tabs)");
      }
    }
  }, [onBack, router]);

  const webViewMemoizedProps = useMemo(
    () => ({
      source: { uri: url },
      onLoadStart: handleLoadStart,
      onLoadEnd: handleLoadEnd,
      className: "flex-1",
      startInLoadingState: true,
      cacheEnabled: true,
      domStorageEnabled: true,
      javaScriptEnabled: true,
      originWhitelist: ["*"],
      ...webViewProps,
    }),
    [url, handleLoadStart, handleLoadEnd, webViewProps],
  );

  return (
    <SafeAreaView className="flex-1 bg-theme" edges={safeAreaEdges}>
      <View className="flex-1 bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark">
        <View className="w-full flex-row items-center justify-between bg-theme p-3">
          <View className="max-w-[60%] flex-row items-center gap-2">
            {showBack && (
              <Pressable onPress={handleBack}>
                <BackIcon />
              </Pressable>
            )}
            <Heading.PageTitle value={title} />
          </View>
          {callToAction}
        </View>
        <View className="relative flex-1">
          {isLoading && (
            <Animated.View className="absolute inset-0 z-10 items-center justify-center" style={loaderStyle}>
              <ActivityIndicator color={loaderColor} size="large" />
            </Animated.View>
          )}
          <Animated.View className="flex-1" style={webViewStyle}>
            <WebView {...webViewMemoizedProps} />
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export const WebViewLayout = memo(WebViewLayoutComponent);

WebViewLayout.displayName = "WebViewLayout";
