var React = require('react');
var ReactDOM = require('react-dom');
var FocusTrap = require('../../');

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
      <FocusTrap
        focusTrapOptions={{
          onDeactivate: this.unmountTrap
        }}
      >
        <div className='trap'>
          <p>
            Here is a focus trap <a href='#'>with</a> <a href='#'>some</a> <a href='#'>focusable</a> parts.
          </p>
          <p>
            <button onClick={this.unmountTrap}>
              deactivate trap
            </button>
          </p>
        </div>
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

ReactDOM.render(<DemoOne />, container);
