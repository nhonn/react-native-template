import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import { logger } from "@/utils/logger";
import { captureException } from "@/utils/sentry";

import { migrations } from "./migrations";
import { Note } from "./models/note";
import { schema } from "./schema";

const adapter = new SQLiteAdapter({
  dbName: "app",
  schema,
  migrations,
  // WatermelonDB's JSI adapter depends on React Native's removed RCTCxxBridge API, so use the
  // native bridge dispatcher on both platforms. Needs a development build (not Expo Go).
  jsi: false,
  onSetUpError: (error) => {
    logger.error("Database setup failed:", error);
    captureException(error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [Note],
});

/**
 * Resolves once the schema is created (or migrated). Readers and writers do not wait for it, so
 * await it before the first query or write — on Android schema setup is an async bridge call.
 */
export const databaseReady: Promise<void> = adapter.initializingPromise;
