---
'focus-trap-react': patch
---

Fix bug where global document was being accessed instead of first checking for `focusTrapOptions.document` option (#539)
