const PropTypes = require('prop-types');
const React = require('react');
const createFocusTrap = require('focus-trap');

const checkedProps = [
  'active',
  'paused',
  'tag',
  'focusTrapOptions',
  '_createFocusTrap'
];

const FocusTrapReactContextType = {
  _FocusTrapReact: PropTypes.shape({
    pause: PropTypes.func.isRequired,
    unpause: PropTypes.func.isRequired,
  })
};

class FocusTrap extends React.Component {
  constructor(props) {
    super(props)

    if (typeof document !== 'undefined') {
      this.previouslyFocusedElement = document.activeElement;
    }
  }

  getChildContext() {
    return {
      _FocusTrapReact: {
        pause: () => this.focusTrap.pause(),
        unpause: () => {
          if (this.props.paused === false) {
            this.focusTrap.unpause()
          }
        }
      }
    };
  }

  componentDidMount() {
    // We need to hijack the returnFocusOnDeactivate option,
    // because React can move focus into the element before we arrived at
    // this lifecycle hook (e.g. with autoFocus inputs). So the component
    // captures the previouslyFocusedElement in componentWillMount,
    // then (optionally) returns focus to it in componentWillUnmount.
    const specifiedFocusTrapOptions = this.props.focusTrapOptions;
    const tailoredFocusTrapOptions = {
      returnFocusOnDeactivate: false
    };
    for (const optionName in specifiedFocusTrapOptions) {
      if (!specifiedFocusTrapOptions.hasOwnProperty(optionName)) continue;
      if (optionName === 'returnFocusOnDeactivate') continue;
      tailoredFocusTrapOptions[optionName] =
        specifiedFocusTrapOptions[optionName];
    }

    this.focusTrap = this.props._createFocusTrap(
      this.node,
      tailoredFocusTrapOptions
    );
    if (this.props.active) {
      this.focusTrap.activate();
    }
    if (this.props.paused) {
      this.focusTrap.pause();
    }

    // if there is a _FocusTrapReact context from a parent focus trap, pause it
    const {_FocusTrapReact: {pause} = {}} = this.context;
    if (pause) pause();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.active && !this.props.active) {
      this.focusTrap.deactivate();
    } else if (!prevProps.active && this.props.active) {
      this.focusTrap.activate();
    }

    if (prevProps.paused && !this.props.paused) {
      this.focusTrap.unpause();
    } else if (!prevProps.paused && this.props.paused) {
      this.focusTrap.pause();
    }
  }

  componentWillUnmount() {
    this.focusTrap.deactivate();
    if (
      this.props.focusTrapOptions.returnFocusOnDeactivate !== false &&
      this.previouslyFocusedElement &&
      this.previouslyFocusedElement.focus
    ) {
      this.previouslyFocusedElement.focus();
    }

    // if there is a _FocusTrapReact context from a parent focus trap, activate it
    const {_FocusTrapReact: {unpause} = {}} = this.context;
    if (unpause) unpause();
  }

  setNode = el => {
    this.node = el;
  };

  render() {
    const elementProps = {
      ref: this.setNode
    };

    // This will get id, className, style, etc. -- arbitrary element props
    for (const prop in this.props) {
      if (!this.props.hasOwnProperty(prop)) continue;
      if (checkedProps.indexOf(prop) !== -1) continue;
      elementProps[prop] = this.props[prop];
    }

    return React.createElement(
      this.props.tag,
      elementProps,
      this.props.children
    );
  }
}

FocusTrap.contextTypes = FocusTrapReactContextType;
FocusTrap.childContextTypes = FocusTrapReactContextType;

FocusTrap.defaultProps = {
  active: true,
  tag: 'div',
  paused: false,
  focusTrapOptions: {},
  _createFocusTrap: createFocusTrap
};

module.exports = FocusTrap;
