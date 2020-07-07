# Changelog

## 7.0.1

- Fix: PropTypes definition now supports server-side rendering. #83

## 7.0.0

- Add: Prop types for `<FocusTrap>`.
- Update: `focus-trap` dependency from 4.0.2 to [5.1.0](https://github.com/davidtheclark/focus-trap/blob/master/CHANGELOG.md#510) for the latest features/fixes it provides. #71
- **BREAKING** Update: Only React 16.0+ is supported going forward. #55
- **BREAKING** Update: All dependencies updated to their latest versions.
- Fix: `children`'s type is `React.ReactNode`, not `React.ReactElement`. #66
- Fix: Allow mutable object refs to be used for FocusTrap child. #72
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
  - An effect of this change is that *positive tabindexes are no longer guaranteed to work as expected*. You should avoid these.

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

- Introduce `dist/focus-trap-react.js`, where `src/` now compiles to, since React 15.5+ demands `class`es, so Babel-compilation.
  Which is actually a huge overhaul, though in semver it's just a patch.

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
