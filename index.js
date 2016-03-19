var React = require('react');
var focusTrap = require('focus-trap');

var PropTypes = React.PropTypes;

var FocusTrap = React.createClass({
  propTypes: {
    onDeactivate: PropTypes.func.isRequired,
    escapeDeactivates: PropTypes.bool,
    clickOutsideDeactivates: PropTypes.bool,
    active: PropTypes.bool,
    className: PropTypes.string,
    id: PropTypes.string,
    initialFocus: PropTypes.string,
    tag: PropTypes.string,
    style: PropTypes.object,
  },

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
    return React.createElement(this.props.tag, {
      className: this.props.className,
      id: this.props.id,
      style: this.props.style,
      ref: function(el) { this.node = el; }.bind(this),
    }, this.props.children);
  },
});

module.exports = FocusTrap;
