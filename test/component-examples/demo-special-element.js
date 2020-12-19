const React = require('react');
const FocusTrap = require('../../src/focus-trap-react');

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
          <button onClick={this.mountTrap}>activate trap</button>
          <button onClick={this.updatePassThruMsg}>pass thru click</button>
          <span data-testid="pass-thru-click">{this.state.passThruMsg}</span>
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
              <button onClick={this.unmountTrap}>deactivate trap</button>
            </p>
          </section>
        </FocusTrap>
      </div>
    );
  }
}

module.exports = DemoSpecialElement;
