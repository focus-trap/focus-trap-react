const React = require('react');
const ReactDOM = require('react-dom');
const FocusTrap = require('../../dist/focus-trap-react');

const container = document.getElementById('demo-special-element');

class DemoSpecialElement extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTrap: false,
      passThruMsg: '',
    };

    this.mountTrap = this.mountTrap.bind(this);
    this.unmountTrap = this.unmountTrap.bind(this);
    this.updatePassThruMsg = this.updatePassThruMsg.bind(this);
  }

  mountTrap() {
    this.setState({ activeTrap: true, passThruMsg: '' });
  }

  unmountTrap() {
    this.setState({ activeTrap: false });
  }

  updatePassThruMsg() {
    this.setState({ passThruMsg: 'Clicked!' });
  }

  render() {
    let trapClass = 'trap';
    if (this.state.activeTrap) {
      trapClass += ' is-active';
    }

    return (
      <div>
        <p>
          <button
            onClick={this.mountTrap}
            aria-label="activate trap for 'special element' demo"
          >
            activate trap
          </button>
          <button onClick={this.updatePassThruMsg}>pass thru click</button>
          <span>{this.state.passThruMsg}</span>
        </p>
        <FocusTrap
          active={this.state.activeTrap}
          focusTrapOptions={{
            onDeactivate: this.unmountTrap,
            clickOutsideDeactivates: true,
            returnFocusOnDeactivate: true,
          }}
        >
          <section
            id="focus-trap-three"
            style={this.state.activeTrap ? null : { background: '#eee' }}
            data-whatever="nothing"
            className={trapClass}
          >
            <p>
              Here is a focus trap <a href="#">with</a> <a href="#">some</a>{' '}
              <a href="#">focusable</a> parts.
            </p>
            <p>
              <button
                onClick={this.unmountTrap}
                aria-label="deactivate trap for 'special element' demo"
              >
                deactivate trap
              </button>
            </p>
          </section>
        </FocusTrap>
      </div>
    );
  }
}

ReactDOM.render(<DemoSpecialElement />, container);
