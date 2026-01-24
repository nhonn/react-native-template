import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

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

export interface ModalLayoutProps {
  title?: string;
  children: ReactNode;
  screenName?: string;
}
