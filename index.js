var React = require('react');
var tabbable = require('tabbable');

var AriaFocusTrap = React.createClass({
  propTypes: {
    onExit: React.PropTypes.func.isRequired,
    className: React.PropTypes.string,
    id: React.PropTypes.string,
    initialFocusId: React.PropTypes.string,
    style: React.PropTypes.object,
    tag: React.PropTypes.string,
  },

  getDefaultProps: function() {
    return {
      tag: 'div',
    };
  },

  componentDidMount: function() {
    this.activate();
  },

  componentWillUnmount: function() {
    this.deactivate();
  },

  activate: function() {
    this.updateTabbableNodes();
    this.previouslyFocused = document.activeElement;
    var focusNode = (this.props.initialFocusId)
      ? document.getElementById(this.props.initialFocusId)
      : this.tabbableNodes[0];
    focusNode.focus();

    document.addEventListener('focus', this.checkFocus, true);
    document.addEventListener('click', this.checkClick, true);
    document.addEventListener('touchend', this.checkClick, true);
  },

  deactivate: function() {
    document.removeEventListener('focus', this.checkFocus, true);
    document.removeEventListener('click', this.checkClick, true);
    document.removeEventListener('touchend', this.checkClick, true);
    this.previouslyFocused.focus();
  },

  updateTabbableNodes: function() {
    this.tabbableNodes = tabbable(React.findDOMNode(this));
  },

  checkClick: function(e) {
    if (React.findDOMNode(this).contains(e.target)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
  },

  checkFocus: function(e) {
    this.updateTabbableNodes();
    if (React.findDOMNode(this).contains(e.target)) return;
    this.tabbableNodes[0].focus();
  },

  checkKey: function(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      this.updateTabbableNodes();
      var currentFocusIndex = this.tabbableNodes.indexOf(e.target);
      var lastTabbableNode = this.tabbableNodes[this.tabbableNodes.length - 1];
      var firstTabbableNode = this.tabbableNodes[0];
      if (e.shiftKey) {
        if (e.target === firstTabbableNode) {
          lastTabbableNode.focus();
          return;
        }
        this.tabbableNodes[currentFocusIndex - 1].focus();
        return;
      }
      if (e.target === lastTabbableNode) {
        firstTabbableNode.focus();
        return;
      }
      this.tabbableNodes[currentFocusIndex + 1].focus();
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      if (this.props.onExit) this.props.onExit();
      setTimeout(function() {
        this.previouslyFocused.focus();
      }.bind(this), 0);
    }
  },

  render: function() {
    return React.createElement(this.props.tag,
      {
        onKeyDown: this.checkKey,
        className: this.props.className,
        id: this.props.id,
        style: this.props.style,
      },
      this.props.children
    );
  },
});

module.exports = AriaFocusTrap;
