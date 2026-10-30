import { Database } from "react-native-watermelondb";
import SQLiteAdapter from "react-native-watermelondb/adapters/sqlite";

import { logger } from "@/utils/logger";
import { captureException } from "@/utils/sentry";

import { migrations } from "./migrations";
import { Note } from "./models/note";
import { schema } from "./schema";

const adapter = new SQLiteAdapter({
  dbName: "app",
  schema,
  migrations,
  // Nitro C++ engine; calls run synchronously on the JS thread. Needs a development build.
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
