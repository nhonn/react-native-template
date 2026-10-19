import { Q } from "@nozbe/watermelondb";
import { useDatabase } from "@nozbe/watermelondb/react";
import { useCallback, useEffect, useState } from "react";

import { databaseReady, type Note } from "@/data";
import { logger } from "@/utils/logger";

export function useNotes() {
  const database = useDatabase();
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    databaseReady
      .then(() => {
        if (cancelled) {
          return;
        }
        const subscription = database
          .get<Note>("notes")
          .query(Q.sortBy("created_at", Q.desc))
          .observe()
          .subscribe(setNotes);
        unsubscribe = () => subscription.unsubscribe();
      })
      .catch((error: unknown) => logger.error("Database not ready:", error));

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [database]);

  const addNote = useCallback(
    async (title: string): Promise<boolean> => {
      const trimmed = title.trim();
      if (!trimmed) {
        return false;
      }
      try {
        await databaseReady;
        await database.write(async () => {
          await database.get<Note>("notes").create((note) => {
            note.title = trimmed;
          });
        });
        return true;
      } catch (error: unknown) {
        logger.error("Failed to add note:", error);
        return false;
      }
    },
    [database],
  );

  return { notes, addNote };
}
