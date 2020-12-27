const React = require('react');
const ReactDOM = require('react-dom');
const FocusTrap = require('../../dist/focus-trap-react');

const container = document.getElementById('demo-autofocus');

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
    const trap = this.state.activeTrap && (
      <FocusTrap
        focusTrapOptions={{
          onDeactivate: this.unmountTrap,
        }}
      >
        <div className="trap is-active">
          <button
            onClick={this.unmountTrap}
            aria-label="deactivate trap for 'autofocus' demo"
          >
            deactivate trap
          </button>
          <div>
            <a href="#">Another focusable thing</a>
          </div>
          <div>
            <label htmlFor="autofocused-input" style={{ marginRight: 10 }}>
              Autofocused input:
            </label>
            <input
              id="autofocused-input"
              autoFocus
              data-testid="autofocus-el"
            />
          </div>
        </div>
      </FocusTrap>
    );

    return (
      <div>
        <p>
          <button
            key="button"
            onClick={this.mountTrap}
            aria-label="activate trap for 'autofocus' demo"
          >
            activate trap
          </button>
        </p>
        {trap}
      </div>
    );
  }
}

ReactDOM.render(<DemoAutofocus />, container);
