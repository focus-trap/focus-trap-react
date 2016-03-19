# focus-trap-react [![Build Status](https://travis-ci.org/davidtheclark/focus-trap-react.svg?branch=0.1.0)](https://travis-ci.org/davidtheclark/focus-trap-react)

A React component that traps focus.

This component is a light wrapper around [focus-trap](https://github.com/davidtheclark/focus-trap),
tailored to your React-specific needs.

You might want it for, say, building an accessible modal?

## What it does

[Check out the demo](http://davidtheclark.github.io/focus-trap-react/demo/).

Please read [the focus-trap documentation](https://github.com/davidtheclark/focus-trap) to understand what a focus trap is, what happens when a focus trap is activated, and what happens when one is deactivated.

This module simply provides a React component that creates a focus trap.

- The focus trap automatically activates when mounted (by default, though this can be changed).
- The focus trap automatically deactivates when unmounted.

## Installation

```
npm install focus-trap-react
```

### React dependency

Version 2+ is compatible with React 0.14.x.

Version 1 is compatible with React 0.13.x.

## Browser Support

Basically IE9+. See `.zuul.yml` for more details.

Why? Because this module's core functionality comes from focus-trap, which uses [a couple of IE9+ functions](https://github.com/davidtheclark/tabbable#browser-support).

Automated testing is done with [zuul](https://github.com/defunctzombie/zuul) and [Open Suace](https://saucelabs.com/opensauce/).

## Usage

Read code in `demo/` (it's very simple), and [see how it works](http://davidtheclark.github.io/focus-trap-react/demo/).

Here's one simple example:

```js
var React = require('react');
var FocusTrap = require('focus-trap-react');

var DemoOne = React.createClass({
  getInitialState: function() {
    return {
      activeTrap: false,
    };
  },

  mountTrap: function() {
    this.setState({ activeTrap: true });
  },

  unmountTrap: function() {
    this.setState({ activeTrap: false });
  },

  render: function() {
    var trap = (this.state.activeTrap) ? (
      <FocusTrap
        onDeactivate={this.unmountTrap}
        className='trap'
      >
        <p>
          Here is a focus trap <a href='#'>with</a> <a href='#'>some</a> <a href='#'>focusable</a> parts.
        </p>
        <p>
          <button onClick={this.unmountTrap}>
            deactivate trap
          </button>
        </p>
      </FocusTrap>
    ) : false;

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
  },
});
```

Easy enough.

### Props

#### onDeactivate

Type: `Function`, *required*

This function is called when the `FocusTrap` deactivates. If, for example, a user hits Escape within the `FocusTrap`, the trap deactivates; and you need to tell it what to do next. The `FocusTrap` does not manage its own visible/hidden state: you do that.

#### initialFocus

Type: `String`, optional

By default, when the `FocusTrap` activates it will pass focus to the first element in its tab order. If you want that initial focus to pass to some other element (e.g. a Submit button at the bottom of a modal dialog),
pass **a selector identifying the element that should receive initial focus** when the `FocusTrap` activates.
(This will be passed to `document.querySelector()` to find the element.)

See `demo/demo-two.jsx`.

### escapeDeactivates

Type: `Boolean`, Default: true

If `false`, the Escape key will not trigger deactivation of the focus trap. This can be useful if you want to force the user to make a decision instead of allowing an easy way out.

### clickOutsideDeactivates

Type: Boolean, Default: false

If `true`, a click outside the focus trap will deactivate the focus trap and allow the click event to carry on.

#### active

Type: `Boolean`, optional

By default, the `FocusTrap` activates when it mounts. So you activate and deactivate it via mounting and unmounting. If, however, you want to keep the `FocusTrap` mounted *while still toggling its activation state*, you can do that with this prop.

See `demo/demo-three.jsx`.

#### tag

Type: `String`, Default: `div`, optional

An HTML tag for the FocusTrap's DOM node.

#### additional props

All props not mentioned above are passed directly to the `<div>` element. This means that you can pass `id`, `className`, `style`, `aria-`attributes, `data-`attributes, or any other arbitrary property that you want to use to customize the element.

## Contributing & Development

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

Lint with `npm run lint`.

Test with `npm run test-dev`, which will give you a URL to open in your browser. Look at the console log for TAP output.
