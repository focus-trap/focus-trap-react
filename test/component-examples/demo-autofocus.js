const React = require('react');
const FocusTrap = require('../../src/focus-trap-react');

class DemoAutofocus extends React.Component {
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
          <button onClick={this.unmountTrap}>deactivate trap</button>
          <div>
            <a href="#">Another focusable thing</a>
          </div>
          <div>
            Autofocused input:
            <input autoFocus={true} data-testid={'autofocus-el'} />
          </div>
        </div>
      </FocusTrap>
    ) : (
      false
    );

    return (
      <div>
        <p>
          <button key="button" onClick={this.mountTrap}>
            activate trap
          </button>
        </p>
        {trap}
      </div>
    );
  }
}

module.exports = DemoAutofocus;
