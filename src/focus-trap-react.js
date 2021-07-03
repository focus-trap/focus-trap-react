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

      if (optionName === 'onPostDeactivate') {
        this.onPostDeactivate = focusTrapOptions[optionName];
        continue;
      }

      this.tailoredFocusTrapOptions[optionName] = focusTrapOptions[optionName];
    }

    // elements from which to create the focus trap on mount; if a child is used
    //  instead of the `containerElements` prop, we'll get the child's related
    //  element when the trap renders and then is declared 'mounted'
    this.focusTrapElements = props.containerElements || [];

    // now we remember what the currently focused element is, not relying on focus-trap
    this.updatePreviousElement();
  }

  // TODO: Need more test coverage for this function
  getNodeForOption(optionName) {
    const optionValue = this.tailoredFocusTrapOptions[optionName];
    if (!optionValue) {
      return null;
    }

    let node = optionValue;

    if (typeof optionValue === 'string') {
      node = document.querySelector(optionValue);
      if (!node) {
        throw new Error(`\`${optionName}\` refers to no known node`);
      }
    }

    if (typeof optionValue === 'function') {
      node = optionValue();
      if (!node) {
        throw new Error(`\`${optionName}\` did not return a node`);
      }
    }

    return node;
  }

  getReturnFocusNode() {
    const node = this.getNodeForOption('setReturnFocus');

    return node ? node : this.previouslyFocusedElement;
  }

  /** Update the previously focused element with the currently focused element. */
  updatePreviousElement() {
    if (typeof document !== 'undefined') {
      this.previouslyFocusedElement = document.activeElement;
    }
  }

  deactivateTrap() {
    const { checkCanReturnFocus } = this.tailoredFocusTrapOptions;

    if (this.focusTrap) {
      // NOTE: we never let the trap return the focus since we do that ourselves
      this.focusTrap.deactivate({ returnFocus: false });
    }

    const finishDeactivation = () => {
      const returnFocusNode = this.getReturnFocusNode();
      const canReturnFocus =
        returnFocusNode?.focus && this.returnFocusOnDeactivate;

      if (canReturnFocus) {
        /** Returns focus to the element that had focus when the trap was activated. */
        returnFocusNode.focus();
      }

      if (this.onPostDeactivate) {
        this.onPostDeactivate.call(null); // don't call it in context of "this"
      }
    };

    if (checkCanReturnFocus) {
      checkCanReturnFocus(this.getReturnFocusNode()).then(
        finishDeactivation,
        finishDeactivation
      );
    } else {
      finishDeactivation();
    }
  }

  setupFocusTrap() {
    if (!this.focusTrap) {
      const focusTrapElementDOMNodes = this.focusTrapElements.map(
        // NOTE: `findDOMNode()` does not support CSS selectors; it'll just return
        //  a new text node with the text wrapped in it instead of treating the
        //  string as a selector and resolving it to a node in the DOM
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
    if (this.focusTrap) {
      if (prevProps.containerElements !== this.props.containerElements) {
        this.focusTrap.updateContainerElements(this.props.containerElements);
      }

      const hasActivated = !prevProps.active && this.props.active;
      const hasDeactivated = prevProps.active && !this.props.active;
      const hasPaused = !prevProps.paused && this.props.paused;
      const hasUnpaused = prevProps.paused && !this.props.paused;

      if (hasActivated) {
        this.updatePreviousElement();
        this.focusTrap.activate();
      }

      if (hasDeactivated) {
        this.deactivateTrap();
        return; // un/pause does nothing on an inactive trap
      }

      if (hasPaused) {
        this.focusTrap.pause();
      }

      if (hasUnpaused) {
        this.focusTrap.unpause();
      }
    } else if (prevProps.containerElements !== this.props.containerElements) {
      this.focusTrapElements = this.props.containerElements;
      this.setupFocusTrap();
    }
  }

  componentWillUnmount() {
    this.deactivateTrap();
  }

  render() {
    const child = this.props.children
      ? React.Children.only(this.props.children)
      : undefined;

    if (child) {
      if (child.type && child.type === React.Fragment) {
        throw new Error(
          'A focus-trap cannot use a Fragment as its child container. Try replacing it with a <div> element.'
        );
      }

      const composedRefCallback = (element) => {
        const { containerElements } = this.props;

        if (child) {
          if (typeof child.ref === 'function') {
            child.ref(element);
          } else if (child.ref) {
            child.ref.current = element;
          }
        }

        this.focusTrapElements = containerElements
          ? containerElements
          : [element];
      };

      const childWithRef = React.cloneElement(child, {
        ref: composedRefCallback,
      });

      return childWithRef;
    }

    return null;
  }
}

// support server-side rendering where `Element` will not be defined
const ElementType = typeof Element === 'undefined' ? Function : Element;

FocusTrap.propTypes = {
  active: PropTypes.bool,
  paused: PropTypes.bool,
  focusTrapOptions: PropTypes.shape({
    onActivate: PropTypes.func,
    onPostActivate: PropTypes.func,
    checkCanFocusTrap: PropTypes.func,
    onDeactivate: PropTypes.func,
    onPostDeactivate: PropTypes.func,
    checkCanReturnFocus: PropTypes.func,
    initialFocus: PropTypes.oneOfType([
      PropTypes.instanceOf(ElementType),
      PropTypes.string,
      PropTypes.func,
      PropTypes.bool,
    ]),
    fallbackFocus: PropTypes.oneOfType([
      PropTypes.instanceOf(ElementType),
      PropTypes.string,
      PropTypes.func,
    ]),
    escapeDeactivates: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    clickOutsideDeactivates: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.func,
    ]),
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
