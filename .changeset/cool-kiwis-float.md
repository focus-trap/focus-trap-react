---
'focus-trap-react': patch
---

Throw an error if a Fragment is given as the child container (currently, it appears to work, but the trap is actually not activated because focus-trap can't find the DOM element for the Fragment "container". (Fixes #268)
