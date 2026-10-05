## High-Frequency External Updates

- Trace live data through ingress parsing, normalization, state writes, subscription notification, React work, layout, paint, and animation. Measure the expensive boundary instead of assuming message handling or rendering is dominant.
- When intermediate values are not observable product behavior, keep the latest pending value per logical key and flush all keys with one frame scheduler. Prefer this to independent per-item timers, which add callbacks, latency, and cleanup work. Preserve every event when ordering, counts, alerts, or other semantics require it.
- Batch notifications or writes at the narrowest shared source that still preserves behavior. Do not add separate schedulers at multiple layers or make every consumer debounce the same stream.
- Keep high-frequency values out of broad objects and contexts. Subscribe the smallest leaf to the smallest primitive it renders so one item's update does not invalidate sibling rows or stable shells.
- Create item-scoped stores, subscriptions, and expensive adapters only when an item is observed or rendered. Define retention or cleanup when the key space can grow without bound.
- Do not maintain parallel "live" and "static" copies of a feature-rich row merely to narrow subscriptions. Share the stable presentation and isolate volatile leaves unless measurement shows that a separate implementation earns its feature-drift cost.
- Treat reducing event frequency, suppressing animations, or dropping visible intermediate states as product decisions. A transparent optimization must preserve the existing visible and data behavior under rapid updates.
