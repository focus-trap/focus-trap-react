const React = require('react');
const ReactDOM = require('react-dom');
const createFocusTrap = require('focus-trap');

class FocusTrap extends React.Component {
  constructor(props) {
    super(props)

    if (typeof document !== 'undefined') {
      this.previouslyFocusedElement = document.activeElement;
    }
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

    const focusTrapElementDOMNode = ReactDOM.findDOMNode(this.focusTrapElement);

    this.focusTrap = this.props._createFocusTrap(
      focusTrapElementDOMNode,
      tailoredFocusTrapOptions
    );
    if (this.props.active) {
      this.focusTrap.activate();
    }
    if (this.props.paused) {
      this.focusTrap.pause();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.active && !this.props.active) {
      const { returnFocusOnDeactivate } = this.props.focusTrapOptions;
      const returnFocus = returnFocusOnDeactivate || false;
      const config = { returnFocus };
      this.focusTrap.deactivate(config);
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
  }

  setFocusTrapElement = element => {
    this.focusTrapElement = element;
  };

  render() {
    const child = React.Children.only(this.props.children);

    const composedRefCallback = element => {
      this.setFocusTrapElement(element);
      if (typeof child.ref === 'function') {
        child.ref(element);
      }
    }

    const childWithRef = React.cloneElement(child, { ref: composedRefCallback });

    return childWithRef;
  }
}

FocusTrap.defaultProps = {
  active: true,
  paused: false,
  focusTrapOptions: {},
  _createFocusTrap: createFocusTrap
};

module.exports = FocusTrap;
