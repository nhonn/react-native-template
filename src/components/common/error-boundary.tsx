import { resetToTabs } from "@/navigation/navigation-ref";
import { Component, type ErrorInfo, type FC, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

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

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("title")}</Text>
          <Text style={styles.message}>{t("message")}</Text>
        </View>
        <View style={styles.actions}>
          <Pressable
            accessibilityLabel={t("try_again")}
            accessibilityRole="button"
            onPress={onReset}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>{t("try_again")}</Text>
          </Pressable>
          <Pressable
            accessibilityLabel={t("go_home")}
            accessibilityRole="button"
            onPress={onGoHome}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>{t("go_home")}</Text>
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
    resetToTabs();
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

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[8],
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing[8],
  },
  title: {
    marginBottom: theme.spacing[2],
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text.primary,
  },
  message: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text.secondary,
  },
  actions: {
    gap: theme.spacing[3],
  },
  primaryButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.text.primary,
    paddingVertical: theme.spacing[3.5],
    paddingHorizontal: theme.spacing[4],
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.background.primary,
  },
  secondaryButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
    backgroundColor: theme.colors.background.primary,
    paddingVertical: theme.spacing[3.5],
    paddingHorizontal: theme.spacing[4],
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text.secondary,
  },
}));
