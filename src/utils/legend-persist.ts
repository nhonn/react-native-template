import {
  internal,
  setAtPath,
  type Change,
  type ObservablePersistLocal,
  type PersistMetadata,
  type PersistOptionsLocal,
} from "@legendapp/state";

import { storage } from "./storage";

const METADATA_SUFFIX = "__m";
const { safeParse, safeStringify } = internal;

/**
 * Legend State local persist plugin backed by the app MMKV instance.
 * The built-in plugin uses react-native-mmkv v3 (`new MMKV()`), which is incompatible with v4.
 */
export class ObservablePersistMMKVNative implements ObservablePersistLocal {
  private data: Record<string, unknown> = {};

  getTable<T = unknown>(table: string, _config: PersistOptionsLocal, init: object): T {
    if (this.data[table] === undefined) {
      try {
        const value = storage.getString(table);
        this.data[table] = value ? safeParse(value) : init;
      } catch {
        this.data[table] = init;
      }
    }

    return this.data[table] as T;
  }

  getMetadata(table: string, config: PersistOptionsLocal): PersistMetadata {
    return this.getTable(table + METADATA_SUFFIX, config, {});
  }

  set(table: string, changes: Change[], _config: PersistOptionsLocal): void {
    if (!this.data[table]) {
      this.data[table] = {};
    }

    for (const change of changes) {
      this.data[table] = setAtPath(
        this.data[table] as Record<string, unknown>,
        change.path,
        change.pathTypes,
        change.valueAtPath,
      );
    }

    this.save(table);
  }

  setMetadata(table: string, metadata: PersistMetadata, _config: PersistOptionsLocal): void {
    this.data[table + METADATA_SUFFIX] = metadata;
    this.save(table + METADATA_SUFFIX);
  }

  deleteTable(table: string, _config: PersistOptionsLocal): void {
    delete this.data[table];
    storage.remove(table);
  }

  deleteMetadata(table: string, config: PersistOptionsLocal): void {
    this.deleteTable(table + METADATA_SUFFIX, config);
  }

  private save(table: string) {
    const value = this.data[table];
    if (value === undefined || value === null) {
      storage.remove(table);
      return;
    }

    storage.set(table, safeStringify(value));
  }
}
