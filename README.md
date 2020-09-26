# focus-trap-react [![CI](https://github.com/focus-trap/focus-trap-react/workflows/CI/badge.svg?branch=master&event=push)](https://github.com/focus-trap/focus-trap-react/actions?query=workflow:CI+branch:master) [![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-12-orange.svg?style=flat-square)](#contributors)
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

Version 2+ is compatible with React >0.14+.

Version 1 is compatible with React 0.13.

## Browser Support

Basically IE9+.

Why? Because this module's core functionality comes from focus-trap, which uses [a couple of IE9+ functions](https://github.com/davidtheclark/tabbable#browser-support).

## Usage

You wrap any element that you want to act as a focus trap with the `<FocusTrap>` component. `<FocusTrap>` expects exactly one child element which can be any HTML element or other React component that contains focusable elements.

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

```js
const React = require('react');
const ReactDOM = require('react-dom');
const FocusTrap = require('../../dist/focus-trap-react');

const container = document.getElementById('demo-one');

class DemoOne extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTrap: false
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

ReactDOM.render(<DemoOne />, container);
```

### Props

#### focusTrapOptions

Type: `Object`, optional

Pass any of the options available in [`focus-trap`'s `createOptions`](https://github.com/focus-trap/focus-trap#focustrap--createfocustrapelement-createoptions).

#### active

Type: `Boolean`, optional

By default, the `FocusTrap` activates when it mounts. So you activate and deactivate it via mounting and unmounting. If, however, you want to keep the `FocusTrap` mounted *while still toggling its activation state*, you can do that with this prop.

See `demo/demo-three.jsx`.

#### paused

Type: `Boolean`, optional

If you would like to pause or unpause the focus trap (see [`focus-trap`'s documentation](https://github.com/focus-trap/focus-trap#focustrappause)), toggle this prop.

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md).

## Contributors

In alphabetical order:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/Ayc0"><img src="https://avatars3.githubusercontent.com/u/22725671?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Benjamin Koltes</b></sub></a><br /><a href="https://github.com/stefcameron/focus-trap-react/issues?q=author%3AAyc0" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://ofcr.se/"><img src="https://avatars1.githubusercontent.com/u/813865?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Benjamin Tan</b></sub></a><br /><a href="https://github.com/stefcameron/focus-trap-react/commits?author=bnjmnt4n" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/DSil"><img src="https://avatars1.githubusercontent.com/u/6265045?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Daniel</b></sub></a><br /><a href="#maintenance-DSil" title="Maintenance">🚧</a> <a href="https://github.com/stefcameron/focus-trap-react/commits?author=DSil" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://davidtheclark.com/"><img src="https://avatars2.githubusercontent.com/u/628431?v=4?s=100" width="100px;" alt=""/><br /><sub><b>David Clark</b></sub></a><br /><a href="https://github.com/stefcameron/focus-trap-react/commits?author=davidtheclark" title="Code">💻</a> <a href="https://github.com/stefcameron/focus-trap-react/issues?q=author%3Adavidtheclark" title="Bug reports">🐛</a> <a href="#infra-davidtheclark" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/stefcameron/focus-trap-react/commits?author=davidtheclark" title="Tests">⚠️</a> <a href="https://github.com/stefcameron/focus-trap-react/commits?author=davidtheclark" title="Documentation">📖</a> <a href="#maintenance-davidtheclark" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/features/security"><img src="https://avatars1.githubusercontent.com/u/27347476?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dependabot</b></sub></a><br /><a href="#maintenance-dependabot" title="Maintenance">🚧</a></td>
    <td align="center"><a href="http://kathleenmcmahon.dev/"><img src="https://avatars1.githubusercontent.com/u/11621935?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kathleen McMahon</b></sub></a><br /><a href="#maintenance-resource11" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://marais.io/"><img src="https://avatars2.githubusercontent.com/u/599459?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Marais Rossouw</b></sub></a><br /><a href="#infra-maraisr" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/liunate"><img src="https://avatars2.githubusercontent.com/u/38996291?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nate Liu</b></sub></a><br /><a href="https://github.com/stefcameron/focus-trap-react/commits?author=liunate" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://www.linkedin.com/in/rivajunior/"><img src="https://avatars1.githubusercontent.com/u/11370172?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Rivaldo Junior</b></sub></a><br /><a href="#maintenance-rivajunior" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://scottrippey.github.io/"><img src="https://avatars3.githubusercontent.com/u/430608?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Scott Rippey</b></sub></a><br /><a href="https://github.com/stefcameron/focus-trap-react/commits?author=scottrippey" title="Code">💻</a> <a href="https://github.com/stefcameron/focus-trap-react/issues?q=author%3Ascottrippey" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://seanmcp.com/"><img src="https://avatars1.githubusercontent.com/u/6360367?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sean McPherson</b></sub></a><br /><a href="https://github.com/stefcameron/focus-trap-react/commits?author=SeanMcP" title="Code">💻</a></td>
    <td align="center"><a href="https://stefancameron.com/"><img src="https://avatars3.githubusercontent.com/u/2855350?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Stefan Cameron</b></sub></a><br /><a href="https://github.com/stefcameron/focus-trap-react/commits?author=stefcameron" title="Code">💻</a> <a href="https://github.com/stefcameron/focus-trap-react/issues?q=author%3Astefcameron" title="Bug reports">🐛</a> <a href="#infra-stefcameron" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/stefcameron/focus-trap-react/commits?author=stefcameron" title="Tests">⚠️</a> <a href="https://github.com/stefcameron/focus-trap-react/commits?author=stefcameron" title="Documentation">📖</a> <a href="#maintenance-stefcameron" title="Maintenance">🚧</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
