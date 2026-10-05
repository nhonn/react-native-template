## Recycling

Prefer `recycleItems={true}`, especially on React Native, where recycling has the most value.

- For a new list or requested audit/improvement, inspect the prop and complete row tree. If omitted, enable it when the row is recycling-safe. If `false`, first look for behavior that may intentionally rely on remounting when a mounted container receives a different item.
- Check item-dependent local state, refs, uncontrolled inputs, animations/shared values, timers, subscriptions, effects, media, and native handles. Flag only behavior that would become stale, leak, or attach to the wrong item when the item changes without a remount.
- Classify state before choosing a fix. Use `useRecyclingState` only for container-local state that should reset when that container receives another item; it does not remember a value for an item after unmount or reuse. Keep item-persistent UI state in item-keyed ownership, and keep optimistic or server-backed state in its canonical query or data cache so every appearance of the item agrees.
- When reasonably fixable, use a stable `useRecyclingEffect` for cleanup or work when the item changes. Key only the smallest subtree that truly requires a remount, then enable recycling.
- Follow the root skill’s [action boundary](../SKILL.md#doing-vs-suggesting): make the migration when it is within requested and approved scope. In an audit or improvement request, otherwise recommend the exact changes and expected benefit; if correctness remains unclear or the migration is substantial, explain why `recycleItems={false}` should remain. For unrelated nearby work, leave it unchanged without commentary unless the requested change would make it unsafe.
