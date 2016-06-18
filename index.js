var React = require('react');
var createFocusTrap = require('focus-trap');

var PropTypes = React.PropTypes;
var checkedProps = {
  active: PropTypes.bool,
  paused: PropTypes.bool,
  tag: PropTypes.string,
  focusTrapOptions: PropTypes.object,
};

var FocusTrap = React.createClass({
  propTypes: checkedProps,

  getDefaultProps: function() {
    return {
      active: true,
      tag: 'div',
      paused: false,
    };
  },

  componentDidMount: function() {
    this.focusTrap = createFocusTrap(this.node, this.props.focusTrapOptions);
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
