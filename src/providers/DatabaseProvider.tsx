import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { useDrizzleMigrations } from "@/db/client";

interface DatabaseProviderProps {
  children: ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const { success, error } = useDrizzleMigrations();

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>{`Migration error: ${error.message}`}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Initializing database…</Text>
      </View>
    );
  }

  return children as any;
}
