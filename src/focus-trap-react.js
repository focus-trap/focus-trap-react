const React = require('react');
const ReactDOM = require('react-dom');
const PropTypes = require('prop-types');
const { createFocusTrap } = require('focus-trap');

// TODO: These issues are related to older React features which we'll likely need
//  to fix in order to move the code forward to the next major version of React.
//  @see https://github.com/davidtheclark/focus-trap-react/issues/77
/* eslint-disable react/no-find-dom-node */

class FocusTrap extends React.Component {
  constructor(props) {
    super(props);

    // We need to hijack the returnFocusOnDeactivate option,
    // because React can move focus into the element before we arrived at
    // this lifecycle hook (e.g. with autoFocus inputs). So the component
    // captures the previouslyFocusedElement in componentWillMount,
    // then (optionally) returns focus to it in componentWillUnmount.
    this.tailoredFocusTrapOptions = {
      returnFocusOnDeactivate: false,
    };

    // because of the above, we maintain our own flag for this option, and
    //  default it to `true` because that's focus-trap's default
    this.returnFocusOnDeactivate = true;

    const { focusTrapOptions } = props;
    for (const optionName in focusTrapOptions) {
      if (!Object.prototype.hasOwnProperty.call(focusTrapOptions, optionName)) {
        continue;
      }

      if (optionName === 'returnFocusOnDeactivate') {
        this.returnFocusOnDeactivate = !!focusTrapOptions[optionName];
        continue;
      }

      this.tailoredFocusTrapOptions[optionName] = focusTrapOptions[optionName];
    }

    // now we remember what the currently focused element is, not relying on focus-trap
    this.updatePreviousElement();
  }

  /** Update the previously focused element with the currently focused element. */
  updatePreviousElement() {
    if (typeof document !== 'undefined') {
      this.previouslyFocusedElement = document.activeElement;
    }
  }

  /** Returns focus to the element that had focus when the trap was activated. */
  returnFocus() {
    if (this.previouslyFocusedElement && this.previouslyFocusedElement.focus) {
      this.previouslyFocusedElement.focus();
    }
  }

  setupFocusTrap() {
    if (!this.focusTrap) {
      const focusTrapElementDOMNodes = this.focusTrapElements.map(
        ReactDOM.findDOMNode
      );

      const nodesExist = focusTrapElementDOMNodes.some(Boolean);
      if (nodesExist) {
        // eslint-disable-next-line react/prop-types -- _createFocusTrap is an internal prop
        this.focusTrap = this.props._createFocusTrap(
          focusTrapElementDOMNodes,
          this.tailoredFocusTrapOptions
        );

        if (this.props.active) {
          this.focusTrap.activate();
        }

        if (this.props.paused) {
          this.focusTrap.pause();
        }
      }
    }
  }

  componentDidMount() {
    this.setupFocusTrap();
  }

  componentDidUpdate(prevProps) {
    this.setupFocusTrap();

    if (this.focusTrap) {
      if (prevProps.containerElements !== this.props.containerElements) {
        this.focusTrap.updateContainerElements(this.props.containerElements);
      }

      if (prevProps.active && !this.props.active) {
        // NOTE: we never let the trap return the focus since we do that ourselves
        this.focusTrap.deactivate({ returnFocus: false });
        if (this.returnFocusOnDeactivate) {
          this.returnFocus();
        }
        return; // un/pause does nothing on an inactive trap
      }

      if (!prevProps.active && this.props.active) {
        this.updatePreviousElement();
        this.focusTrap.activate();
      }

      if (prevProps.paused && !this.props.paused) {
        this.focusTrap.unpause();
      } else if (!prevProps.paused && this.props.paused) {
        this.focusTrap.pause();
      }
    }
  }

  componentWillUnmount() {
    // NOTE: we never let the trap return the focus since we do that ourselves
    if (this.focusTrap) {
      this.focusTrap.deactivate({ returnFocus: false });
    }

    if (this.returnFocusOnDeactivate) {
      this.returnFocus();
    }
  }

  setFocusTrapElements = (elements) => {
    this.focusTrapElements = elements;
  };

  render() {
    const child = React.Children.only(this.props.children);

    const composedRefCallback = (element) => {
      const { containerElements } = this.props;

      if (typeof child.ref === 'function') {
        child.ref(element);
      } else if (child.ref) {
        child.ref.current = element;
      }

      const elements = containerElements ? containerElements : [element];
      this.setFocusTrapElements(elements);
    };

    const childWithRef = React.cloneElement(child, {
      ref: composedRefCallback,
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
      PropTypes.func,
    ]),
    fallbackFocus: PropTypes.oneOfType([
      PropTypes.instanceOf(ElementType),
      PropTypes.string,
      PropTypes.func,
    ]),
    escapeDeactivates: PropTypes.bool,
    clickOutsideDeactivates: PropTypes.bool,
    returnFocusOnDeactivate: PropTypes.bool,
    setReturnFocus: PropTypes.oneOfType([
      PropTypes.instanceOf(ElementType),
      PropTypes.string,
      PropTypes.func,
    ]),
    allowOutsideClick: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    preventScroll: PropTypes.bool,
  }),
  containerElements: PropTypes.arrayOf(PropTypes.instanceOf(ElementType)),
  children: PropTypes.oneOfType([
    PropTypes.element, // React element
    PropTypes.instanceOf(ElementType), // DOM element
  ]),

  // NOTE: _createFocusTrap is internal, for testing purposes only, so we don't
  //  specify it here. It's expected to be set to the function returned from
  //  require('focus-trap'), or one with a compatible interface.
};

FocusTrap.defaultProps = {
  active: true,
  paused: false,
  focusTrapOptions: {},
  _createFocusTrap: createFocusTrap,
};

module.exports = FocusTrap;
