var React = require('react');
var createFocusTrap = require('focus-trap');

var PropTypes = React.PropTypes;
var checkedProps = {
  active: PropTypes.bool.isRequired,
  paused: PropTypes.bool.isRequired,
  tag: PropTypes.string.isRequired,
  focusTrapOptions: PropTypes.object.isRequired,
};

var FocusTrap = React.createClass({
  propTypes: checkedProps,

  getDefaultProps: function() {
    return {
      active: true,
      tag: 'div',
      paused: false,
      focusTrapOptions: {},
    };
  },

  componentWillMount: function() {
    if (typeof document !== 'undefined') {
      this.previouslyFocusedElement = document.activeElement;
    }
  },

  componentDidMount: function() {
    // We need to hijack the returnFocusOnDeactivate option,
    // because React can move focus into the element before we arrived at
    // this lifecycle hook (e.g. with autoFocus inputs). So the component
    // captures the previouslyFocusedElement in componentWillMount,
    // then (optionally) returns focus to it in componentWillUnmount.
    var specifiedFocusTrapOptions = this.props.focusTrapOptions;
    var tailoredFocusTrapOptions = {
      returnFocusOnDeactivate: false,
    };
    for (var optionName in specifiedFocusTrapOptions) {
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
  },

  componentDidUpdate: function(prevProps) {
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
  },

  componentWillUnmount: function() {
    this.focusTrap.deactivate();
    if (this.props.focusTrapOptions.returnFocusOnDeactivate !== false && this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
    }
  },

  render: function() {
    var props = this.props;

    var elementProps = {
      ref: function(el) { this.node = el; }.bind(this),
    };

    // This will get id, className, style, etc. -- arbitrary element props
    for (var prop in props) {
      if (!props.hasOwnProperty(prop)) continue;
      if (checkedProps[prop]) continue;
      elementProps[prop] = props[prop];
    }

    return React.createElement(this.props.tag, elementProps, this.props.children);
  },
});

module.exports = FocusTrap;
