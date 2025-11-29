import { open } from "@op-engineering/op-sqlite";
import { drizzle } from "drizzle-orm/op-sqlite";
import { useMigrations } from "drizzle-orm/op-sqlite/migrator";
import migrations from "../../drizzle/migrations";

export const opsqliteDb = open({ name: "app" });
export const db = drizzle(opsqliteDb);

export function useDrizzleMigrations() {
  return useMigrations(db, migrations);
}
