const React = require('react');
const PropTypes = require('prop-types');
const createFocusTrap = require('focus-trap');

const checkedProps = {
  active: PropTypes.bool.isRequired,
  paused: PropTypes.bool.isRequired,
  tag: PropTypes.string.isRequired,
  focusTrapOptions: PropTypes.object.isRequired,
};

class FocusTrap extends React.Component {

  componentWillMount() {
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
      returnFocusOnDeactivate: false,
    };
    for (const optionName in specifiedFocusTrapOptions) {
      if (!specifiedFocusTrapOptions.hasOwnProperty(optionName)) continue;
      if (optionName === 'returnFocusOnDeactivate') continue;
      tailoredFocusTrapOptions[optionName] = specifiedFocusTrapOptions[optionName];
    }

    this.focusTrap = createFocusTrap(this.node, tailoredFocusTrapOptions);
    if (this.props.active) {
      this.focusTrap.activate();
    }
    if (this.props.paused) {
      this.focusTrap.pause();
    }
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
    if (this.props.focusTrapOptions.returnFocusOnDeactivate !== false && this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
    }
  }

  render() {
    const props = this.props;

    const elementProps = {
      ref: function(el) {
        this.node = el;
      }.bind(this),
    };

    // This will get id, className, style, etc. -- arbitrary element props
    for (const prop in props) {
      if (!props.hasOwnProperty(prop)) continue;
      if (checkedProps[prop]) continue;
      elementProps[prop] = props[prop];
    }

    return React.createElement(this.props.tag, elementProps, this.props.children);
  }

}

FocusTrap.propTypes = checkedProps;

FocusTrap.defaultProps = {
  active: true,
  tag: 'div',
  paused: false,
  focusTrapOptions: {},
};

module.exports = FocusTrap;
