import { schemaMigrations } from "react-native-watermelondb/Schema/migrations";

// Add one `{ toVersion, steps }` entry per schema version bump, e.g.
// `{ toVersion: 2, steps: [addColumns({ table: "notes", columns: [...] })] }`.
export const migrations = schemaMigrations({
  migrations: [],
});
