var React = require('react');
var ReactDOM = require('react-dom');
var FocusTrap = require('../../');

var container = document.getElementById('demo-five');

var DemoFive = React.createClass({
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
          onDeactivate: this.unmountTrap,
        }}
      >
        <div className='trap'>
          <button onClick={this.unmountTrap}>
            deactivate trap
          </button>
          <div>
            <a href='#'>Another focusable thing</a>
          </div>
          <div>
            Autofocused input: <input autoFocus={true} />
          </div>
        </div>
      </FocusTrap>
    ) : false;

    return (
      <div>
        <p>
          <button key='button' onClick={this.mountTrap}>
            activate trap
          </button>
        </p>
        {trap}
      </div>
    );
  },
});

ReactDOM.render(<DemoFive />, container);
