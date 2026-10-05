## Persistence And Sync

- Put complete defaults in the observable's initial value or the sync plugin's documented `initial` option when backward compatibility permits.
- Normalize and validate persisted data at the persistence boundary so render consumers receive one local shape.
- Preserve literal types with `const` generics or explicit store types when helpers would widen settings values.
- Use `synced(...)` or a synced plugin when sync is part of the observable's definition; pass it to `observable` or `useObservable`. It activates lazily on the first `get()`.
- Use `syncObservable(value$, options)` to attach sync or persistence to an existing observable; it starts when called.
- Use `configureSynced` to create reusable defaults for `synced` or a sync plugin, and `syncState(value$)` to access load and sync status or controls.
- Prefer built-in transforms, retry, `waitFor`, and persistence plugins over hand-written load/save effects.
- Test migration behavior before removing runtime default merging from existing persisted stores.
- Keep public export and type coverage when changing Legend State itself.
