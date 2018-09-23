# Changelog

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
