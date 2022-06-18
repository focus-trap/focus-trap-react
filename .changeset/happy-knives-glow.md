---
'focus-trap-react': patch
---

Fix an issue when running in strict mode which has React immediately unmount/remount the trap, causing it to deactivate and then have to reactivate (per existing component state) on the remount. [#720](https://github.com/focus-trap/focus-trap-react/issues/720)
