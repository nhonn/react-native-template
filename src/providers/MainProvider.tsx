import type { ReactNode } from "react";

import { ErrorBoundary } from "@/components/common/ErrorBoundary";

interface MainProviderProps {
  children: ReactNode;
}

export function MainProvider({ children }: MainProviderProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
