# focus-trap-react [![CI](https://github.com/focus-trap/focus-trap-react/workflows/CI/badge.svg?branch=master&event=push)](https://github.com/focus-trap/focus-trap-react/actions?query=workflow:CI+branch:master) [![Codecov](https://img.shields.io/codecov/c/github/focus-trap/focus-trap-react)](https://codecov.io/gh/focus-trap/focus-trap-react) [![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-28-orange.svg?style=flat-square)](#contributors)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

A React component that traps focus.

This component is a light wrapper around [focus-trap](https://github.com/focus-trap/focus-trap),
tailored to your React-specific needs.

You might want it for, say, building [an accessible modal](https://github.com/davidtheclark/react-aria-modal)?

## What it does

[Check out the demo](http://focus-trap.github.io/focus-trap-react/demo/).

Please read [the focus-trap documentation](https://github.com/focus-trap/focus-trap) to understand what a focus trap is, what happens when a focus trap is activated, and what happens when one is deactivated.

This module simply provides a React component that creates and manages a focus trap.

- The focus trap automatically activates when mounted (by default, though this can be changed).
- The focus trap automatically deactivates when unmounted.
- The focus trap can be activated and deactivated, paused and unpaused via props.

## Installation

```
npm install focus-trap-react
```

`dist/focus-trap-react.js` is the Babel-compiled file that you'll use.

### React dependency

React `>= 16.3.0`

## Browser Support

As old and as broad as _reasonably_ possible, excluding browsers that are out of support or have nearly no user base.

Focused on desktop browsers, particularly Chrome, Edge, FireFox, Safari, and Opera.

Focus-trap-react is not officially tested on any mobile browsers or devices.

> ⚠️ Microsoft [no longer supports](https://blogs.windows.com/windowsexperience/2022/06/15/internet-explorer-11-has-retired-and-is-officially-out-of-support-what-you-need-to-know/) any version of IE, so IE is no longer supported by this library.

> 💬 Focus-trap-react relies on focus-trap so its browser support is at least [what focus-trap supports](https://github.com/focus-trap/focus-trap#browser-support).

> 💬 Keep in mind that performance optimization and old browser support are often at odds, so tabbable may not always be able to use the most optimal (typically modern) APIs in all cases.

## Usage

You wrap any element that you want to act as a focus trap with the `<FocusTrap>` component. `<FocusTrap>` expects exactly one child element which can be any HTML element or other React component that contains focusable elements. __It cannot be a Fragment__ because `<FocusTrap>` needs to be able to get a reference to the underlying HTML element, and Fragments do not have any representation in the DOM.

For example:

```js
<FocusTrap>
  <div id="modal-dialog" className="modal" >
    <button>Ok</button>
    <button>Cancel</button>
  </div>
</FocusTrap>
```

```js
<FocusTrap>
  <ModalDialog okButtonText="Ok" cancelButtonText="Cancel" />
</FocusTrap>
```

You can read further code examples in `demo/` (it's very simple), and [see how it works](http://focus-trap.github.io/focus-trap-react/demo/).

Here's one more simple example:

```jsx
const React = require('react');
const ReactDOM = require('react-dom'); // React 16-17
const { createRoot } = require('react-dom/client'); // React 18
const FocusTrap = require('focus-trap-react');

class Demo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTrap: false
    };

    this.mountTrap = this.mountTrap.bind(this);
    this.unmountTrap = this.unmountTrap.bind(this);
  }

  mountTrap = () => {
    this.setState({ activeTrap: true });
  };

  unmountTrap = () => {
    this.setState({ activeTrap: false });
  };

  render() {
    const trap = this.state.activeTrap
      ? <FocusTrap
          focusTrapOptions={{
            onDeactivate: this.unmountTrap
          }}
        >
          <div className="trap">
            <p>
              Here is a focus trap
              {' '}
              <a href="#">with</a>
              {' '}
              <a href="#">some</a>
              {' '}
              <a href="#">focusable</a>
              {' '}
              parts.
            </p>
            <p>
              <button onClick={this.unmountTrap}>
                deactivate trap
              </button>
            </p>
          </div>
        </FocusTrap>
      : false;

    return (
      <div>
        <p>
          <button onClick={this.mountTrap}>
            activate trap
          </button>
        </p>
        {trap}
      </div>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById('root')); // React 16-17
createRoot(document.getElementById('root')).render(<Demo />); // React 18
```

## ❗️❗️ React 18 Strict Mode ❗️❗️

React 18 introduced [new behavior](https://reactjs.org/docs/strict-mode.html#ensuring-reusable-state) in Strict Mode whereby it mimics a possible future behavior where React might optimize an app's performance by unmounting certain components that aren't in use and later remounting them with previous, reused state when the user needs them again. What constitutes "not in use" and "needs them again" is as yet undefined.

_Remounted with reused state_ is the key difference between what is otherwise expected about [unmounted components](https://reactjs.org/docs/react-component.html#componentwillunmount).

__[v9.0.2](https://github.com/focus-trap/focus-trap-react/pull/721) adds support__ for this new Strict Mode behavior: The trap attempts to detect that it has been remounted with previous state: If the `active` prop's value is `true`, and an internal focus trap instance already exists, the focus trap is re-activated on remount in order to reconcile stated expectations.

> 🚨 In Strict Mode (and so in dev builds only, since this behavior of Strict Mode only affects dev builds), the trap __will be deactivated as soon as it is mounted__, and then reactivated again, almost immediately, because React will immediately unmount and remount the trap as soon as it's rendered.

Therefore, __avoid using options like onActivate, onPostActivate, onDeactivate, or onPostDeactivate to affect component state__.

<details>
<summary>Explanation and sample anti-pattern to <strong>avoid</strong></summary>
<p>
See <a href="https://github.com/focus-trap/focus-trap-react/issues/796">this discussion</a> for an example sandbox (issue description) where <code>onDeactivate</code> was used to trigger the close of a dialog when the trap was deactivated (e.g. to react to the user clicking outside the trap with <code>focusTrapOptions.clickOutsideDeactivates=true</code>).
</p>
<p>
The result can be that (depending on how you render the trap) in Strict Mode, the dialog never appears because it gets closed as soon as the trap renders, since the trap is deactivated as soon as it's unmounted, and so the <code>onDeactivate</code> handler is called, thus hiding the dialog...
</p>
<p>
<strong>This is intentional</strong>: If the trap gets unmounted, it has no idea if it's being unmounted <em>for good</em> or if it's going to be remounted <em>at some future point in time</em>. It also has no idea of knowing <em>how long</em> it will be until it's remounted again. So it must be deactivated as though it's going away for good in order to prevent unintentional behavior and memory leaks (from orphaned document event listeners).
</p>
</details>

## Props

### children

> ⚠️ The `<FocusTrap>` component requires a __single__ child, and this child must __forward refs__ onto the element which will ultimately be considered the trap's container. Since React does not provide for a way to forward refs to class-based components, this means the child must be a __functional__ component that uses the `React.forwardRef()` API.
>
> If you must use a __class__-based component as the trap's container, then you will need to get your own ref to it upon render, and use the `containerElements` prop (initially set to an empty array `[]`) in order to provide the ref's element to it once updated by React (hint: use a [callback ref](https://reactjs.org/docs/refs-and-the-dom.html#callback-refs)).

> 💬 The child is ignored (but still rendered) if the `containerElements` prop is used to imperatively provide trap container elements.

Example:

```jsx
const React = require('react');
const { createRoot } = require('react-dom/client');
const propTypes = require('prop-types');
const FocusTrap = require('../../dist/focus-trap-react');

const container = document.getElementById('demo-function-child');

const TrapChild = React.forwardRef(function ({ onDeactivate }, ref) {
  return (
    <div ref={ref}>
      <p>
        Here is a focus trap <a href="#">with</a> <a href="#">some</a>{' '}
        <a href="#">focusable</a> parts.
      </p>
      <p>
        <button
          onClick={onDeactivate}
          aria-describedby="class-child-heading"
        >
          deactivate trap
        </button>
      </p>
    </div>
  );
});

TrapChild.displayName = 'TrapChild';
TrapChild.propTypes = {
  onDeactivate: propTypes.func,
};

class DemoFunctionChild extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTrap: false,
    };

    this.mountTrap = this.mountTrap.bind(this);
    this.unmountTrap = this.unmountTrap.bind(this);
  }

  mountTrap() {
    this.setState({ activeTrap: true });
  }

  unmountTrap() {
    this.setState({ activeTrap: false });
  }

  render() {
    const trap = this.state.activeTrap && (
      <FocusTrap
        focusTrapOptions={{
          onDeactivate: this.unmountTrap,
        }}
      >
        <TrapChild />
      </FocusTrap>
    );

    return (
      <div>
        <p>
          <button onClick={this.mountTrap} aria-describedby="function-child-heading">
            activate trap
          </button>
        </p>
        {trap}
      </div>
    );
  }
}

const root = createRoot(container);
root.render(<DemoFunctionChild />);
```

### focusTrapOptions

Type: `Object`, optional

Pass any of the options available in focus-trap's [createOptions](https://github.com/focus-trap/focus-trap#createoptions).

> ❗️ This prop is __only read once__ on the first render. It's never looked at again. This is particularly important if you use state-dependent memoized __React Hooks__ (e.g. `const onActivate = useCallback(() => {...}, [something])`) for any of the focus-trap callbacks like `onActivate()`, `onDeactivate()`, `clickOutsideDeactivates()`, etc.
>
> If you need state-dependent callbacks, you have two options: __(1)__ Use a React component `class` (as in the examples in this README) with bound member handlers, or __(2)__ use a React Ref like `useRef({ myState: 1 })` in your callbacks and manually manage your state.
>
> See [#947](https://github.com/focus-trap/focus-trap-react/issues/947) for more details.

> ⚠️ See notes about __[testing in JSDom](#testing-in-jsdom)__ (e.g. using Jest) if that's what you currently use.

### active

Type: `Boolean`, optional

By default, the `FocusTrap` activates when it mounts. So you activate and deactivate it via mounting and unmounting. If, however, you want to keep the `FocusTrap` mounted *while still toggling its activation state*, you can do that with this prop.

See `demo/demo-special-element.js`.

### paused

Type: `Boolean`, optional

If you would like to pause or unpause the focus trap (see [`focus-trap`'s documentation](https://github.com/focus-trap/focus-trap#focustrappause)), toggle this prop.

### containerElements

Type: `Array of HTMLElement`, optional

If specified, these elements will be used as the boundaries for the focus-trap, __instead of the child__.  These get passed as arguments to `focus-trap`'s `updateContainerElements()` method.

> 💬 Note that when you use `containerElements`, the need for a child is eliminated as the child is __always__ ignored (though still rendered) when the prop is specified, even if this prop is `[]` (an empty array).
>
> Also note that if the refs you're putting into the array, like `containerElements={[ref1.current, ref2.current]}`, aren't resolved yet, resulting in `[null, null]` for example, the trap will not get created. The array must contain at least one valid `HTMLElement` in order for the trap to get created/updated.

If `containerElements` is subsequently updated (i.e. after the trap has been created) to an empty array (or an array of falsy values like `[null, null]`), the trap will still be active, but the TAB key will do nothing because the trap will not contain any tabbable groups of nodes. At this point, the trap can either be deactivated manually or by unmounting, or an updated set of elements can be given to `containerElements` to resume use of the TAB key.

Using `containerElements` does require the use of React refs which, by nature, will require at least one state update in order to get the resolved elements into the prop, resulting in at least one additional render. In the normal case, this is likely more than acceptable, but if you really want to optimize things, then you could consider [using focus-trap directly](https://codesandbox.io/s/focus-trapreact-containerelements-demos-v5ydi) (see `Trap2.js`).

## Help

### Testing in JSDom

> ⚠️ JSDom is not officially supported. Your mileage may vary, and tests may break from one release to the next (even a patch or minor release).
>
> This topic is just here to help with what we know may affect your tests.

In general, a focus trap is best tested in a full browser environment such as Cypress, Playwright, or Nightwatch where a full DOM is available.

Sometimes, that's not entirely desirable, and depending on what you're testing, you may be able to get away with using JSDom (e.g. via Jest), but you'll have to configure your traps using the `focusTrapOptions.tabbableOptions.displayCheck: 'none'` option.

See [Testing focus-trap in JSDom](https://github.com/focus-trap/focus-trap#testing-in-jsdom) for more details.

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md).

## Contributors

In alphabetical order:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/AlexKDawson"><img src="https://avatars.githubusercontent.com/u/16471362?v=4?s=100" width="100px;" alt="Alex Dawson"/><br /><sub><b>Alex Dawson</b></sub></a><br /><a href="https://github.com/focus-trap/focus-trap-react/commits?author=AlexKDawson" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Ayc0"><img src="https://avatars3.githubusercontent.com/u/22725671?v=4?s=100" width="100px;" alt="Benjamin Koltes"/><br /><sub><b>Benjamin Koltes</b></sub></a><br /><a href="https://github.com/focus-trap/focus-trap-react/issues?q=author%3AAyc0" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://ofcr.se/"><img src="https://avatars1.githubusercontent.com/u/813865?v=4?s=100" width="100px;" alt="Benjamin Tan"/><br /><sub><b>Benjamin Tan</b></sub></a><br /><a href="https://github.com/focus-trap/focus-trap-react/commits?author=bnjmnt4n" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://clintgoodman.com"><img src="https://avatars3.githubusercontent.com/u/5473697?v=4?s=100" width="100px;" alt="Clint Goodman"/><br /><sub><b>Clint Goodman</b></sub></a><br /><a href="https://github.com/focus-trap/focus-trap-react/commits?author=cgood92" title="Code">💻</a> <a href="https://github.com/focus-trap/focus-trap-react/commits?author=cgood92" title="Documentation">📖</a> <a href="#example-cgood92" title="Examples">💡</a> <a href="https://github.com/focus-trap/focus-trap-react/commits?author=cgood92" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/DSil"><img src="https://avatars1.githubusercontent.com/u/6265045?v=4?s=100" width="100px;" alt="Daniel"/><br /><sub><b>Daniel</b></sub></a><br /><a href="#maintenance-DSil" title="Maintenance">🚧</a> <a href="https://github.com/focus-trap/focus-trap-react/commits?author=DSil" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Dan503"><img src="https://avatars.githubusercontent.com/u/10610368?v=4?s=100" width="100px;" alt="Daniel Tonon"/><br /><sub><b>Daniel Tonon</b></sub></a><br /><a href="https://github.com/focus-trap/focus-trap-react/commits?author=Dan503" title="Documentation">📖</a> <a href="https://github.com/focus-trap/focus-trap-react/commits?author=Dan503" title="Code">💻</a> <a href="https://github.com/focus-trap/focus-trap-react/commits?author=Dan503" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://davidtheclark.com/"><img src="https://avatars2.githubusercontent.com/u/628431?v=4?s=100" width="100px;" alt="David Clark"/><br /><sub><b>David Clark</b></sub></a><br /><a href="https://github.com/focus-trap/focus-trap-react/commits?author=davidtheclark" title="Code">💻</a> <a href="https://github.com/focus-trap/focus-trap-react/issues?q=author%3Adavidtheclark" title="Bug reports">🐛</a> <a href="#infra-davidtheclark" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/focus-trap/focus-trap-react/commits?author=davidtheclark" title="Tests">⚠️</a> <a href="https://github.com/focus-trap/focus-trap-react/commits?author=davidtheclark" title="Documentation">📖</a> <a href="#maintenance-davidtheclark" title="Maintenance">🚧</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/features/security"><img src="https://avatars1.githubusercontent.com/u/27347476?v=4?s=100" width="100px;" alt="Dependabot"/><br /><sub><b>Dependabot</b></sub></a><br /><a href="#maintenance-dependabot" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jhnns"><img src="https://avatars.githubusercontent.com/u/781746?v=4?s=100" width="100px;" alt="Johannes Ewald"/><br /><sub><b>Johannes Ewald</b></sub></a><br /><a href="https://github.com/focus-trap/focus-trap-react/commits?author=jhnns" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://josuzuki.me"><img src="https://avatars1.githubusercontent.com/u/9583920?v=4?s=100" width="100px;" alt="Jonathan Suzuki"/><br /><sub><b>Jonathan Suzuki</b></sub></a><br /><a href="https://github.com/focus-trap/focus-trap-react/issues?q=author%3AJoSuzuki" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://reload.dk"><img src="https://avatars.githubusercontent.com/u/73966?v=4?s=100" width="100px;" alt="Kasper Garnæs"/><br /><sub><b>Kasper Garnæs</b></sub></a><br /><a href="https://github.com/focus-trap/focus-trap-react/issues?q=author%3Akasperg" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://kathleenmcmahon.dev/"><img src="https://avatars1.githubusercontent.com/u/11621935?v=4?s=100" width="100px;" alt="Kathleen McMahon"/><br /><sub><b>Kathleen McMahon</b></sub></a><br /><a href="#maintenance-resource11" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/LoganDark"><img src="https://avatars.githubusercontent.com/u/4723091?v=4?s=100" width="100px;" alt="LoganDark"/><br /><sub><b>LoganDark</b></sub></a><br /><a href="https://github.com/focus-trap/focus-trap-react/issues?q=author%3ALoganDark" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://marais.io/"><img src="https://avatars2.githubusercontent.com/u/599459?v=4?s=100" width="100px;" alt="Marais Rossouw"/><br /><sub><b>Marais Rossouw</b></sub></a><br /><a href="#infra-maraisr" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/StackOverflowIsBetterThanAnyAI"><img src="https://avatars.githubusercontent.com/u/140268904?v=4?s=100" width="100px;" alt="Michael"/><br /><sub><b>Michael</b></sub></a><br /><a href="#example-StackOverflowIsBetterThanAnyAI" title="Examples">💡</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.moroshko.me"><img src="https://avatars.githubusercontent.com/u/259753?v=4?s=100" width="100px;" alt="Misha Moroshko"/><br /><sub><b>Misha Moroshko</b></sub></a><br /><a href="https://github.com/focus-trap/focus-trap-react/issues?q=author%3Amoroshko" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/liunate"><img src="https://avatars2.githubusercontent.com/u/38996291?v=4?s=100" width="100px;" alt="Nate Liu"/><br /><sub><b>Nate Liu</b></sub></a><br /><a href="https://github.com/focus-trap/focus-trap-react/commits?author=liunate" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/rivajunior/"><img src="https://avatars1.githubusercontent.com/u/11370172?v=4?s=100" width="100px;" alt="Rivaldo Junior"/><br /><sub><b>Rivaldo Junior</b></sub></a><br /><a href="#maintenance-rivajunior" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://scottrippey.github.io/"><img src="https://avatars3.githubusercontent.com/u/430608?v=4?s=100" width="100px;" alt="Scott Rippey"/><br /><sub><b>Scott Rippey</b></sub></a><br /><a href="https://github.com/focus-trap/focus-trap-react/commits?author=scottrippey" title="Code">💻</a> <a href="https://github.com/focus-trap/focus-trap-react/issues?q=author%3Ascottrippey" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://seanmcp.com/"><img src="https://avatars1.githubusercontent.com/u/6360367?v=4?s=100" width="100px;" alt="Sean McPherson"/><br /><sub><b>Sean McPherson</b></sub></a><br /><a href="https://github.com/focus-trap/focus-trap-react/commits?author=SeanMcP" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://smoores.dev"><img src="https://avatars.githubusercontent.com/u/5354254?v=4?s=100" width="100px;" alt="Shane Moore"/><br /><sub><b>Shane Moore</b></sub></a><br /><a href="#platform-SMores" title="Packaging/porting to new platform">📦</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://recollectr.io"><img src="https://avatars2.githubusercontent.com/u/6835891?v=4?s=100" width="100px;" alt="Slapbox"/><br /><sub><b>Slapbox</b></sub></a><br /><a href="https://github.com/focus-trap/focus-trap-react/commits?author=Slapbox" title="Documentation">📖</a> <a href="https://github.com/focus-trap/focus-trap-react/issues?q=author%3ASlapbox" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://stefancameron.com/"><img src="https://avatars3.githubusercontent.com/u/2855350?v=4?s=100" width="100px;" alt="Stefan Cameron"/><br /><sub><b>Stefan Cameron</b></sub></a><br /><a href="https://github.com/focus-trap/focus-trap-react/commits?author=stefcameron" title="Code">💻</a> <a href="https://github.com/focus-trap/focus-trap-react/issues?q=author%3Astefcameron" title="Bug reports">🐛</a> <a href="#infra-stefcameron" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/focus-trap/focus-trap-react/commits?author=stefcameron" title="Tests">⚠️</a> <a href="https://github.com/focus-trap/focus-trap-react/commits?author=stefcameron" title="Documentation">📖</a> <a href="#maintenance-stefcameron" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://tylerhawkins.info/201R/"><img src="https://avatars0.githubusercontent.com/u/13806458?v=4?s=100" width="100px;" alt="Tyler Hawkins"/><br /><sub><b>Tyler Hawkins</b></sub></a><br /><a href="https://github.com/focus-trap/focus-trap-react/commits?author=thawkin3" title="Documentation">📖</a> <a href="#example-thawkin3" title="Examples">💡</a> <a href="https://github.com/focus-trap/focus-trap-react/commits?author=thawkin3" title="Tests">⚠️</a> <a href="#tool-thawkin3" title="Tools">🔧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/wandroll"><img src="https://avatars.githubusercontent.com/u/4492317?v=4?s=100" width="100px;" alt="Wandrille Verlut"/><br /><sub><b>Wandrille Verlut</b></sub></a><br /><a href="https://github.com/focus-trap/focus-trap-react/commits?author=wandroll" title="Code">💻</a> <a href="https://github.com/focus-trap/focus-trap-react/commits?author=wandroll" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/krikienoid"><img src="https://avatars3.githubusercontent.com/u/8528227?v=4?s=100" width="100px;" alt="krikienoid"/><br /><sub><b>krikienoid</b></sub></a><br /><a href="https://github.com/focus-trap/focus-trap-react/issues?q=author%3Akrikienoid" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/robert-westenberger"><img src="https://avatars.githubusercontent.com/u/44252092?v=4?s=100" width="100px;" alt="robert-westenberger"/><br /><sub><b>robert-westenberger</b></sub></a><br /><a href="https://github.com/focus-trap/focus-trap-react/commits?author=robert-westenberger" title="Documentation">📖</a> <a href="https://github.com/focus-trap/focus-trap-react/issues?q=author%3Arobert-westenberger" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/syntactic-salt"><img src="https://avatars.githubusercontent.com/u/9385662?v=4?s=100" width="100px;" alt="syntactic-salt"/><br /><sub><b>syntactic-salt</b></sub></a><br /><a href="https://github.com/focus-trap/focus-trap-react/issues?q=author%3Asyntactic-salt" title="Bug reports">🐛</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
