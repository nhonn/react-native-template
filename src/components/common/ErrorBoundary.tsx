import { captureException } from "@sentry/react-native";
import { router } from "expo-router";
import { AlertTriangle, Home, RefreshCw } from "lucide-react-native";
import { Component, type ErrorInfo, type FC, memo, type ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";

import { logger } from "@/utils/logger";
import { Layout } from "../layouts";
import { Button } from "./Button";

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

const ErrorFallback: FC<ErrorFallbackProps> = memo(({ onReset, onGoHome }) => {
  const { t } = useTranslation("error_boundary");

  const alertIcon = useMemo(() => <AlertTriangle color="#ef4444" size={48} />, []);

  const refreshIcon = useMemo(() => <RefreshCw color="white" size={48} />, []);

  const homeIcon = useMemo(() => <Home color="#6b7280" size={48} />, []);

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 py-8" showsVerticalScrollIndicator={false}>
        <View className="mb-8 items-center">
          <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-red-100">{alertIcon}</View>
          <Text className="mb-2 text-center font-bold text-2xl text-gray-900">{t("title")}</Text>
          <Text className="mb-6 text-center text-base text-gray-600">{t("message")}</Text>
        </View>
        <View className="mb-8 space-y-4">
          <Button
            accessibilityLabel={t("try_again")}
            fullWidth
            leftIcon={refreshIcon}
            onPress={onReset}
            size="lg"
            title={t("try_again")}
            variant="primary"
          />
          <Button
            accessibilityLabel={t("go_home")}
            fullWidth
            leftIcon={homeIcon}
            onPress={onGoHome}
            size="lg"
            title={t("go_home")}
            variant="secondary"
          />
        </View>
      </ScrollView>
    </View>
  );
});

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
    router.replace("/");
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Layout.Bare>
          <ErrorFallback onGoHome={this.handleGoHome} onReset={this.handleReset} />
        </Layout.Bare>
      );
    }

    return this.props.children;
  }
}
