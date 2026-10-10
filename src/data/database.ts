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
  // Synchronous JSI mode. Needs a development build (not Expo Go) with
  // expo-watermelondb-plugin applied during prebuild.
  jsi: true,
  onSetUpError: (error) => {
    logger.error("Database setup failed:", error);
    captureException(error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [Note],
});
