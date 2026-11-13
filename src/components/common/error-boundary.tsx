import { router } from "expo-router";
import { Component, type ErrorInfo, type FC, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView } from "react-native";
import { Text, View } from "@tamagui/tailwind";
import { getTokenValue } from "tamagui";

import { logger } from "@/utils/logger";
import { captureException } from "@/utils/sentry";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorFallbackProps {
  onReset: () => void;
  onGoHome: () => void;
}

const ErrorFallback: FC<ErrorFallbackProps> = ({ onReset, onGoHome }) => {
  const { t } = useTranslation("error_boundary");
  const contentStyle = {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: getTokenValue("6", "space"),
    paddingVertical: getTokenValue("8", "space"),
  } as const;

  return (
    <View className="flex-1 bg-background-primary">
      <ScrollView contentContainerStyle={contentStyle} showsVerticalScrollIndicator={false}>
        <View className="mb-8 items-center">
          <Text className="mb-2 text-center text-[24px] font-bold text-text-primary">{t("title")}</Text>
          <Text className="text-center text-[16px] leading-[24px] text-text-secondary">{t("message")}</Text>
        </View>
        <View className="gap-3">
          <Pressable accessibilityLabel={t("try_again")} accessibilityRole="button" onPress={onReset}>
            <View className="items-center justify-center rounded-md bg-text-primary px-4 py-3.5">
              <Text className="text-[16px] font-semibold text-background-primary">{t("try_again")}</Text>
            </View>
          </Pressable>
          <Pressable accessibilityLabel={t("go_home")} accessibilityRole="button" onPress={onGoHome}>
            <View className="items-center justify-center rounded-md border border-border-secondary bg-background-primary px-4 py-3.5">
              <Text className="text-[16px] font-semibold text-text-secondary">{t("go_home")}</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

ErrorFallback.displayName = "ErrorFallback";

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    if (__DEV__) {
      logger.error("Error caught by ErrorBoundary:", error);
      logger.error("Error info:", errorInfo);
    }
    captureException(error);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleGoHome = () => {
    this.handleReset();
    router.replace("/(tabs)");
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback onGoHome={this.handleGoHome} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}
