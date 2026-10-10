import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const schema = appSchema({
  // Bump on every schema change and add a matching step in ./migrations.ts.
  version: 1,
  tables: [
    tableSchema({
      name: "notes",
      columns: [
        { name: "title", type: "string" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
  ],
});
