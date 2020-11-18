---
'focus-trap-react': minor
---

- Remove the need for a child in `<FocusTrap />` when `containerElements` is used. The child was already being ignored anyway (when `containerElements` is used; if the prop is not used, then a single child is still required).
- Update the typings related to the `children` prop to make it optional. Prop-types already had `children` as optional, however the use of `React.Children.only()` in all cases was still forcing the presence of a single child. That's no longer the case.
- Add additional notes about the use of the `containerElements` prop in the documentation.
