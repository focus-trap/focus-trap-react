var React = require('react');
var AriaFocusTrap = require('../../');

var container = document.getElementById('demo-four');

var DemoFour = React.createClass({
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
            <button tabIndex='3'>
              tabindex 3
            </button>
          </p>
          <p>
            <button tabIndex='2'>
              tabindex 2
            </button>
          </p>
          <p>
            <button tabIndex='4'>tabindex 4</button>
          </p>
          <p>
            <button>no tabindex</button>
          </p>
          <p>
            <button onClick={this.unmountTrap} tabIndex='1'>
              deactivate trap (tabindex 1)
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

React.render(<DemoFour />, container);
