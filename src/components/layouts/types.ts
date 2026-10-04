import type { ReactNode } from "react";
import type { ViewProps } from "react-native";

export interface BareLayoutProps {
  children?: ReactNode;
  contentContainerStyle?: ViewProps["style"];
  safeAreaEdges?: ("top" | "bottom" | "left" | "right")[];
}

export interface BaseLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  safeAreaEdges?: ("top" | "bottom" | "left" | "right")[];
  onBack?: () => void;
  callToAction?: ReactNode;
  contentContainerStyle?: ViewProps["style"];
}

export interface ModalLayoutProps {
  title?: string;
  children: ReactNode;
}
