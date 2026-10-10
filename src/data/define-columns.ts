import type { Model } from "@nozbe/watermelondb";

type RawValue = Parameters<Model["_setRaw"]>[1];

/**
 * Defines model properties that read and write WatermelonDB raw columns, without the
 * `@field` decorators (this project does not enable `experimentalDecorators`).
 *
 * Usage: `Object.defineProperties(Note.prototype, defineColumns({ title: "title" }))`
 */
export function defineColumns(spec: Record<string, string>): PropertyDescriptorMap {
  const descriptors: PropertyDescriptorMap = {};
  for (const property of Object.keys(spec)) {
    const column = spec[property];
    descriptors[property] = {
      configurable: true,
      enumerable: true,
      get(this: Model) {
        return this._getRaw(column);
      },
      set(this: Model, value: RawValue) {
        this._setRaw(column, value);
      },
    };
  }
  return descriptors;
}
