---
"focus-trap-react": minor
---

- Adding support for new focus-trap options from focus-trap v6.5.0: `checkCanFocusTrap()`, `onPostActivate()`, `checkCanReturnFocus()`, and `onPostDeactivate()`.
- Adding support (bug fix) for existing focus-trap `setReturnFocus` option that had thus far been ignored, with focus-trap-react always returning focus to the previously-focused element prior to activation regardless of the use of the `setReturnFocus` option. The option is now respected the same as it is when using focus-trap directly.
