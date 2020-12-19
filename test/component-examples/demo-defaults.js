const React = require('react');
const FocusTrap = require('../../src/focus-trap-react');

class DemoDefaults extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTrap: false,
    };

    this.mountTrap = this.mountTrap.bind(this);
    this.unmountTrap = this.unmountTrap.bind(this);
  }

  mountTrap() {
    this.setState({ activeTrap: true });
  }

  unmountTrap() {
    this.setState({ activeTrap: false });
  }

  render() {
    const trap = this.state.activeTrap ? (
      <FocusTrap
        focusTrapOptions={{
          onDeactivate: this.unmountTrap,
        }}
      >
        <div className="trap is-active">
          <p>
            Here is a focus trap <a href="#">with</a> <a href="#">some</a>{' '}
            <a href="#">focusable</a> parts.
          </p>
          <p>
            <button onClick={this.unmountTrap}>deactivate trap</button>
          </p>
        </div>
      </FocusTrap>
    ) : (
      false
    );

    return (
      <div>
        <p>
          <button onClick={this.mountTrap}>activate trap</button>
        </p>
        {trap}
      </div>
    );
  }
}

module.exports = DemoDefaults;
