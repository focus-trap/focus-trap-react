var React = require('react');
var AriaFocusTrap = require('../../');

var container = document.getElementById('demo-one');

var DemoOne = React.createClass({
  getInitialState: function() {
    return {
      activeTrap: false,
    };
  },

  mountTrap: function() {
    this.setState({ activeTrap: true });
  },

  unmountTrap: function() {
    this.setState({ activeTrap: false });
  },

  render: function() {
    var trap = (this.state.activeTrap) ? (
      <div style={{ border: '1px solid', padding: '1em 2em' }}>
        <AriaFocusTrap
          onExit={this.unmountTrap}
        >
          <p>
            Here is a focus trap <a href='#'>with</a> <a href='#'>some</a> <a href='#'>focusable</a> parts.
          </p>
          <p>
            <button onClick={this.unmountTrap}>
              deactivate trap
            </button>
          </p>
        </AriaFocusTrap>
      </div>
    ) : false;

    return (
      <div>
        <p>
          <button onClick={this.mountTrap}>
            activate trap
          </button>
        </p>
        {trap}
      </div>
    );
  },
});

React.render(<DemoOne />, container);
