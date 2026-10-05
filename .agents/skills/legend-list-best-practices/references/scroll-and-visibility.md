## Chat, Scroll, And Visibility

- Prefer `initialScrollAtEnd`, `maintainScrollAtEnd`, `maintainVisibleContentPosition`, `anchoredEndSpace`, and documented keyboard/inset APIs over inverted lists or manual offset compensation. `initialScrollAtEnd` overrides initial index and offset targets.
- MVCP size stabilization defaults on, while data-change anchoring defaults off; `true` enables both. Keep initial placement, data anchoring, end following, composer space, and keyboard avoidance as separate contracts.
- Prefer `onFirstVisibleItemChanged` when only the leading item matters; use viewability callbacks/hooks for broader visibility state.
- Prefer `getState().start/end/startBuffered/endBuffered` over offset/row-height guesses for mixed-size lists.
- Imperative scroll methods are asynchronous. Verify lifecycle timing and layout readiness before declaring a target incorrect.
- When a filter or `dataKey` replacement resets the list position, reset related external scroll-derived state in the same transition. Internal list position does not automatically clear application pills, anchors, unread markers, or "scrolled" flags.
