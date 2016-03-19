var React = require('react');
var focusTrap = require('focus-trap');

var PropTypes = React.PropTypes;
var checkedProps = {
  onDeactivate: PropTypes.func.isRequired,
  escapeDeactivates: PropTypes.bool,
  clickOutsideDeactivates: PropTypes.bool,
  active: PropTypes.bool,
  initialFocus: PropTypes.string,
  tag: PropTypes.string,
};

var FocusTrap = React.createClass({
  propTypes: checkedProps,

  getDefaultProps: function() {
    return {
      active: true,
      tag: 'div',
    };
  },

  componentDidMount: function() {
    if (this.props.active) {
      this.activateTrap();
    }
  },

  componentDidUpdate: function(prevProps) {
    if (prevProps.active && !this.props.active) {
      focusTrap.deactivate();
    } else if (!prevProps.active && this.props.active) {
      this.activateTrap();
    }
  },

  componentWillUnmount: function() {
    focusTrap.deactivate();
  },

  activateTrap: function() {
    if (!this.node) return;
    focusTrap.activate(this.node, {
      onDeactivate: this.props.onDeactivate,
      initialFocus: this.props.initialFocus,
      escapeDeactivates: this.props.escapeDeactivates,
      clickOutsideDeactivates: this.props.clickOutsideDeactivates,
    });
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
