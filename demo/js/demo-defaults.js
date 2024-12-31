const React = require('react');
const { createRoot } = require('react-dom/client');
const { FocusTrap } = require('../../dist/focus-trap-react');

const container = document.getElementById('demo-defaults');

class DemoDefaults extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTrap: false,
    };

    this.mountTrap = this.mountTrap.bind(this);
    this.unmountTrap = this.unmountTrap.bind(this);

    this.containerEl = null;
  }

  mountTrap() {
    this.setState({ activeTrap: true });
  }

  unmountTrap() {
    this.setState({ activeTrap: false });
  }

  // purposely using a ref here to test new React 19 "ref as a prop" behavior
  //  with fallback to React 18 deprecated behavior
  handleCallbackRef(el) {
    this.containerEl = el;
    this.containerEl?.classList.add('is-active');
  }

  render() {
    const trap = this.state.activeTrap && (
      <FocusTrap
        focusTrapOptions={{
          onDeactivate: this.unmountTrap,
        }}
      >
        <div
          className="trap is-active"
          ref={(el) => this.handleCallbackRef(el)}
        >
          <p>
            Here is a focus trap <a href="#">with</a> <a href="#">some</a>{' '}
            <a href="#">focusable</a> parts.
          </p>
          <p>
            <button
              onClick={this.unmountTrap}
              aria-describedby="defaults-heading"
            >
              deactivate trap
            </button>
          </p>
        </div>
      </FocusTrap>
    );

    return (
      <div>
        <p>
          <button onClick={this.mountTrap} aria-describedby="defaults-heading">
            activate trap
          </button>
        </p>
        {trap}
      </div>
    );
  }
}

const root = createRoot(container);
root.render(<DemoDefaults />);
