import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type WebView from "react-native-webview";

export interface BareLayoutProps {
  children?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  safeAreaEdges?: ("top" | "bottom" | "left" | "right")[];
}

export interface BaseLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  safeAreaEdges?: ("top" | "bottom" | "left" | "right")[];
  onBack?: () => void;
  callToAction?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export interface WebViewLayoutProps extends BareLayoutProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  url: string;
  loaderColor?: string;
  animationDuration?: number;
  webViewProps?: Partial<React.ComponentProps<typeof WebView>>;
  callToAction?: ReactNode;
}
