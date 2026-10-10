import { Q } from "@nozbe/watermelondb";
import { useDatabase } from "@nozbe/watermelondb/react";
import { useCallback, useEffect, useState } from "react";

import type { Note } from "@/data";
import { logger } from "@/utils/logger";

export function useNotes() {
  const database = useDatabase();
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const subscription = database
      .get<Note>("notes")
      .query(Q.sortBy("created_at", Q.desc))
      .observe()
      .subscribe(setNotes);

    return () => subscription.unsubscribe();
  }, [database]);

  const addNote = useCallback(
    async (title: string) => {
      const trimmed = title.trim();
      if (!trimmed) {
        return;
      }
      try {
        await database.write(async () => {
          await database.get<Note>("notes").create((note) => {
            note.title = trimmed;
          });
        });
      } catch (error: unknown) {
        logger.error("Failed to add note:", error);
      }
    },
    [database],
  );

  return { notes, addNote };
}
