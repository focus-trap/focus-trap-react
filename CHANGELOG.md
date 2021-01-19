# Changelog

## 8.4.1

### Patch Changes

- a4c3105: Update PropTypes for clickOutsideDeactivates to match latest focus-trap.

## 8.4.0

### Minor Changes

- 8d58bc8: Bump focus-trap to v6.3.0

## 8.3.2

### Patch Changes

- 53fa056: Update `focus-trap` dependency to new patch release v6.2.2 for bug fix to multi-container traps.

## 8.3.1

### Patch Changes

- 5d70831: Bump focus-trap to [6.2.1](https://github.com/focus-trap/focus-trap/blob/master/CHANGELOG.md#621) for bug fixes.

## 8.3.0

### Minor Changes

- c4e4837: Remove the need for a child, update typings, update docs:
  - Remove the need for a child in `<FocusTrap />` when `containerElements` is used. The child was already being ignored anyway (when `containerElements` is used; if the prop is not used, then a single child is still required).
  - Update the typings related to the `children` prop to make it optional. Prop-types already had `children` as optional, however the use of `React.Children.only()` in all cases was still forcing the presence of a single child. That's no longer the case.
  - Add additional notes about the use of the `containerElements` prop in the documentation.

### Patch Changes

- 0836c6d: Fixing a bug where the focus trap may not have been set before it is unmounted #184

## 8.2.0

### Minor Changes

- 76ed007: Add ability to pass containerElements to focus-trap #179. This PR is made possible because of https://github.com/focus-trap/focus-trap/pull/217 and the released version 6.2.0 of focus-trap.

## 8.1.1

### Patch Changes

- 925dfd2: Update the react and react-dom peer dependencies from `^16.0.0` to `>=16.0.0` since this library works with React 17 as well as React 16.
- 01653da: Fix focus not always returning to correct node after setting `active` prop to `false`. #139
- 95f8ab6: Update focus-trap dependency from 6.1.2 to [6.1.4](https://github.com/focus-trap/focus-trap/blob/master/CHANGELOG.md#614). Bug fixes only.

## 8.1.0

### Minor Changes

- 5994a8c: Bump focus-trap from 6.0.1 to 6.1.0. This new version of focus-trap provides a new `delayInitialFocus` flag that can be used to further customize trap behavior.

### Patch Changes

- 0562ef0: Change `prepublishOnly` script to `prepare` script so that it also runs if someone installs the package directly from the git repo (e.g. from your work in which you fixed a bug or added a feature you're waiting to get merged to master and published to NPM).

## 8.0.0

### Major Changes

- 513a2d3: **BREAKING**: Updated [focus-trap](https://github.com/focus-trap/focus-trap/blob/master/CHANGELOG.md#600) dependency to new 6.0.1 release, which contains breaking changes. This update means it's also now using the latest version of [tabbable](https://github.com/focus-trap/tabbable/blob/master/CHANGELOG.md#500), which also has breaking changes. See respective CHANGELOGs for details.

### Patch Changes

- 35040fa: Remove call for maintainers. @stefcameron and @maraisr hope to take up the charge. Additional help and contributors are most welcome for anyone interested!
- 513a2d3: Changed code formatting to use dangling commas where ES5 supports them.

## 7.0.1

- Fix: PropTypes definition now supports server-side rendering. [#83](https://github.com/davidtheclark/focus-trap-react/issues/83)

## 7.0.0

- Add: Prop types for `<FocusTrap>`.
- Update: `focus-trap` dependency from 4.0.2 to [5.1.0](https://github.com/davidtheclark/focus-trap/blob/master/CHANGELOG.md#510) for the latest features/fixes it provides. [#71](https://github.com/davidtheclark/focus-trap-react/issues/71)
- **BREAKING** Update: Only React 16.0+ is supported going forward. [#55](https://github.com/davidtheclark/focus-trap-react/issues/55)
- **BREAKING** Update: All dependencies updated to their latest versions.
- Fix: `children`'s type is `React.ReactNode`, not `React.ReactElement`. [#66](https://github.com/davidtheclark/focus-trap-react/issues/66)
- Fix: Allow mutable object refs to be used for FocusTrap child. [#72](https://github.com/davidtheclark/focus-trap-react/issues/72)
- Fix: `specifiedFocusTrapOptions.includes(optionName)` statement in `componentDidMount()` was causing an exception because `includes()` is not a function defined on `Object`.

## 6.0.0

- Update focus-trap to 4.0.2, which includes [a queue of traps](https://github.com/davidtheclark/focus-trap/blob/master/CHANGELOG.md#400), so when a trap is paused because another trap activates, it will be unpaused when that other trap deactivates. If Trap A was automatically paused because Trap B activated (existing behavior), when Trap B is deactivated Trap A will be automatically unpaused (new behavior).

## 5.0.1

- Fix TypeScript declarations.

## 5.0.0

- **BREAKING:** `<FocusTrap>` now expects exactly one child element which can be any HTML element or other React component that contains focusable elements. The `tag` prop has been removed, as has support for additional props that are passed through to the `tag`, because it is no longer necessary: you should provide your own element, with whatever props you want, as a child of `<FocusTrap>`.

## 4.0.1

- Fix bug that caused `returnFocusOnDeactivate: true` to be ignored when using the `active` prop to activate & deactivate the focus trap.

## 4.0.0

- Update focus-trap to 3.0.0, which includes [a couple of behavior changes](https://github.com/davidtheclark/focus-trap/blob/master/CHANGELOG.md#300). The key change is that focus management has been changed so that you can include tricky focusable elements like radio groups, iframes, and shadow DOM components in your trap — as long as the first and last focusable elements in the trap can still be detected by [Tabbable](https://github.com/davidtheclark/tabbable).
  - An effect of this change is that _positive tabindexes are no longer guaranteed to work as expected_. You should avoid these.

## 3.1.4

- Re-add TypeScript declarations.

## 3.1.3

- Remove `componentWillMount` usage.

## 3.1.2

- Fix TypeScript declarations so props are available on the imported namespace.

## 3.1.1

- Fix React import in TypeScript declarations.

## 3.1.0

- Add TypeScript declarations.

## 3.0.5

- Prevent error in IE edge cases when the previously focused element does not have a `focus()` function.

## 3.0.4

- Allow React v16 peer dependency.

## 3.0.3

- Introduce `dist/focus-trap-react.js`, where `src/` now compiles to, since React 15.5+ demands `class`es, so Babel-compilation. Which is actually a huge overhaul, though in semver it's just a patch.

## 3.0.2

- Fix handling of `focusTrapOptions.returnFocusOnDeactivate` for React-specific kinks like `autoFocus` on inputs.

## 3.0.1

- Upgrade `focus-trap` for important bug fix.

## 3.0.0

- Introduce `focusTrapOptions` prop (and remove redundancies).
- Upgrade to `focus-trap` v2.

## 2.1.1

- Allow React 15 as peer dependency.

## 2.1.0

- Upgrade `focus-trap` to add `escapeDeactivates` and `clickOutsideDeactivates` props.
- Allow arbitrary props passed through to the element itself.

## 2.0.1

- Move `react` to `peerDependencies` and remove `react-dom` dependency.

## 2.0.0

- Upgrade to React 0.14 and its companion ReactDOM.

## 1.0.0

- Initial release.
