var React = require('react');
var ReactDOM = require('react-dom');
var FocusTrap = require('../../');

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
    var trapClass = 'trap';
    if (this.state.activeTrap) trapClass += ' is-active';

    return (
      <div>
        <p>
          <button onClick={this.mountTrap}>
            activate trap
          </button>
        </p>
        <FocusTrap
          onDeactivate={this.unmountTrap}
          clickOutsideDeactivates={true}
          id='focus-trap-three'
          tag='section'
          style={{ background: '#eee' }}
          data-whatever='nothing'
          active={this.state.activeTrap}
          className={trapClass}
        >
        <p>
          Here is a focus trap <a href='#'>with</a> <a href='#'>some</a> <a href='#'>focusable</a> parts.
        </p>
        <p>
          <button onClick={this.unmountTrap}>
            deactivate trap
          </button>
        </p>
      </FocusTrap>
      </div>
    );
  },
});

ReactDOM.render(<DemoThree />, container);
