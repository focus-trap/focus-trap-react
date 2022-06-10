---
'focus-trap-react': major
---

Stop using the infamous `findDOMNode()` on provided `containerElements`. There seems to have been no good reason for this as this prop, if specified, is already required to be an array of HTMLElement references, which means these nodes have already been rendered (if they were once React elements). There appears to have been no remaining need for this API. Furthermore, the minimum supported version of React is now 16.3 as it technically has been for a while now since that is the version that introduced callback refs, which we've been using for quite some time now (so this bump shouldn't cause any ripples).
