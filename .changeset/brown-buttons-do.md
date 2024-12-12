---
'focus-trap-react': patch
---

Fix missing default export in typings; props no longer extend `React.AllHTMLAttributes<any>` to allow things like `className` (those extra props have always been ignored anyway); deprecate default export; add named export in code ([#1396](https://github.com/focus-trap/focus-trap-react/issues/1396))
