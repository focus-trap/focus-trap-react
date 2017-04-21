# Changelog

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
