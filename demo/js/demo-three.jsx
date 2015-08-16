var React = require('react');
var AriaFocusTrap = require('../../');

var container = document.getElementById('demo-three');

var DemoThree = React.createClass({
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
      <AriaFocusTrap
        onExit={this.unmountTrap}
        id='focus-trap-three'
        className='special-focus-trap'
        tag='section'
        style={{ border: '1px solid', padding: '1em 2em' }}
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

React.render(<DemoThree />, container);
