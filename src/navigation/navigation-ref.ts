import { createNavigationContainerRef } from "@react-navigation/native";

import type { RootStackParamList } from "./types";

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function resetToTabs() {
  if (!navigationRef.isReady()) return;
  navigationRef.reset({ index: 0, routes: [{ name: "Tabs" }] });
}
