---
"focus-trap-react": major
---

**BREAKING:** Updated [focus-trap](https://github.com/focus-trap/focus-trap/blob/master/CHANGELOG.md#800) dependency to v8.0.0. The breaking change is that `onPostActivate()` is now correctly called after the initial focus node is focused (it was previously called before due to a bug with the initial focus delay). See the focus-trap changelog for more details.
