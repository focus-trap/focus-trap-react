const React = require('react');
const { createRoot } = require('react-dom/client');
const { FocusTrap } = require('../../dist/focus-trap-react');

const container = document.getElementById('demo-ffne');

class DemoFfne extends React.Component {
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
          initialFocus: '#focused-input',
          escapeDeactivates: false,
        }}
      >
        <div className="trap is-active">
          <p>
            Here is a focus trap <a href="#">with</a> <a href="#">some</a>{' '}
            <a href="#">focusable</a> parts.
          </p>
          <p>
            <label htmlFor="focused-input" style={{ marginRight: 10 }}>
              Initially focused input:
            </label>
            <input id="focused-input" />
          </p>
          <p>
            <button onClick={this.unmountTrap} aria-describedby="ffne-heading">
              deactivate trap
            </button>
          </p>
        </div>
      </FocusTrap>
    );

    return (
      <div>
        <p>
          <button onClick={this.mountTrap} aria-describedby="ffne-heading">
            activate trap
          </button>
        </p>
        {trap}
      </div>
    );
  }
}

const root = createRoot(container);
root.render(<DemoFfne />);
