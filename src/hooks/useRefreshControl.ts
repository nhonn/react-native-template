import { useCallback, useEffect, useRef, useState } from "react";
import { InteractionManager } from "react-native";

import { logger } from "@/utils/logger";

interface UseRefreshControlOptions {
  onRefresh: () => Promise<void> | void;
  enabled?: boolean;
  delay?: number;
}

interface UseRefreshControlReturn {
  refreshing: boolean;
  onRefresh: () => void;
  setRefreshing: (refreshing: boolean) => void;
}

/**
 * Custom hook to handle refresh control state properly and prevent iOS warnings
 */
export const useRefreshControl = ({
  onRefresh,
  enabled = true,
  delay = 0,
}: UseRefreshControlOptions): UseRefreshControlReturn => {
  const [refreshing, setRefreshing] = useState(false);
  const isMounted = useRef(true);
  const refreshTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track component mount state
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }
    };
  }, []);

  // Handle refresh with proper state management
  const handleRefresh = useCallback(async () => {
    if (!(enabled && isMounted.current)) {
      return;
    }

    setRefreshing(true);

    try {
      // Add a small delay to prevent immediate state changes
      if (delay > 0) {
        await new Promise<void>((resolve) => {
          refreshTimeout.current = setTimeout(() => resolve(), delay);
        });
      }

      // Wait for interactions to complete before refreshing
      await InteractionManager.runAfterInteractions();

      if (isMounted.current) {
        await onRefresh();
      }
    } catch (error) {
      logger.warn("Refresh failed:", error);
    } finally {
      // Ensure we're still mounted before updating state
      if (isMounted.current) {
        setRefreshing(false);
      }
    }
  }, [onRefresh, enabled, delay]);

  return {
    refreshing,
    onRefresh: handleRefresh,
    setRefreshing,
  };
};
