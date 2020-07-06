const React = require('react');
const ReactDOM = require('react-dom');
const PropTypes = require('prop-types');
const createFocusTrap = require('focus-trap');

// TODO: These issues are related to older React features which we'll likely need
//  to fix in order to move the code forward to the next major version of React.
//  @see https://github.com/davidtheclark/focus-trap-react/issues/77
/* eslint-disable react/no-find-dom-node */

class FocusTrap extends React.Component {
  constructor(props) {
    super(props);

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
      if (
        !Object.prototype.hasOwnProperty.call(
          specifiedFocusTrapOptions,
          optionName
        )
      ) {
        continue;
      }

      if (optionName === 'returnFocusOnDeactivate') {
        continue;
      }

      tailoredFocusTrapOptions[optionName] =
        specifiedFocusTrapOptions[optionName];
    }

    const focusTrapElementDOMNode = ReactDOM.findDOMNode(this.focusTrapElement);

    // eslint-disable-next-line react/prop-types -- _createFocusTrap is an internal prop
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

  setFocusTrapElement = (element) => {
    this.focusTrapElement = element;
  };

  render() {
    const child = React.Children.only(this.props.children);

    const composedRefCallback = (element) => {
      this.setFocusTrapElement(element);
      if (typeof child.ref === 'function') {
        child.ref(element);
      } else if (child.ref) {
        child.ref.current = element;
      }
    };

    const childWithRef = React.cloneElement(child, {
      ref: composedRefCallback
    });

    return childWithRef;
  }
}

// support server-side rendering where `Element` will not be defined
const ElementType = typeof Element === 'undefined' ? Function : Element;

FocusTrap.propTypes = {
  active: PropTypes.bool,
  paused: PropTypes.bool,
  focusTrapOptions: PropTypes.shape({
    onActivate: PropTypes.func,
    onDeactivate: PropTypes.func,
    initialFocus: PropTypes.oneOfType([
      PropTypes.instanceOf(ElementType),
      PropTypes.string,
      PropTypes.func
    ]),
    fallbackFocus: PropTypes.oneOfType([
      PropTypes.instanceOf(ElementType),
      PropTypes.string,
      PropTypes.func
    ]),
    escapeDeactivates: PropTypes.bool,
    clickOutsideDeactivates: PropTypes.bool,
    returnFocusOnDeactivate: PropTypes.bool,
    setReturnFocus: PropTypes.oneOfType([
      PropTypes.instanceOf(ElementType),
      PropTypes.string,
      PropTypes.func
    ]),
    allowOutsideClick: PropTypes.func,
    preventScroll: PropTypes.bool
  }),
  children: PropTypes.oneOfType([
    PropTypes.element, // React element
    PropTypes.instanceOf(ElementType) // DOM element
  ])

  // NOTE: _createFocusTrap is internal, for testing purposes only, so we don't
  //  specify it here. It's expected to be set to the function returned from
  //  require('focus-trap'), or one with a compatible interface.
};

FocusTrap.defaultProps = {
  active: true,
  paused: false,
  focusTrapOptions: {},
  _createFocusTrap: createFocusTrap
};

module.exports = FocusTrap;
