var React = require('react');
var ReactDOM = require('react-dom');
var FocusTrap = require('../../');

var container = document.getElementById('demo-two');

var DemoTwo = React.createClass({
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
      <FocusTrap
        onDeactivate={this.unmountTrap}
        initialFocus='#focused-input'
        className='trap'
        escapeDeactivates={false}
      >
        <p>
          Here is a focus trap <a href='#'>with</a> <a href='#'>some</a> <a href='#'>focusable</a> parts.
        </p>
        <p>
          <label htmlFor='focused-input' style={{ marginRight: 10 }}>
            Initially focused input
          </label>
          <input refs='input' id='focused-input' />
        </p>
        <p>
          <button onClick={this.unmountTrap}>
            deactivate trap
          </button>
        </p>
      </FocusTrap>
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

ReactDOM.render(<DemoTwo />, container);
