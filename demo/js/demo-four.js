const React = require('react');
const ReactDOM = require('react-dom');
const FocusTrap = require('../../dist/focus-trap-react');

const container = document.getElementById('demo-four');

class DemoFour extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTrap: false
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
    const trap = this.state.activeTrap
      ? <FocusTrap
          className="trap"
          focusTrapOptions={{
            onDeactivate: this.unmountTrap,
            returnFocusOnDeactivate: false
          }}
        >
          <p>
            <button tabIndex="3">
              tabindex 3
            </button>
          </p>
          <p>
            <button tabIndex="2">
              tabindex 2
            </button>
          </p>
          <p>
            <button tabIndex="4">tabindex 4</button>
          </p>
          <p>
            <button>no tabindex</button>
          </p>
          <p>
            <button onClick={this.unmountTrap} tabIndex="1">
              deactivate trap (tabindex 1)
            </button>
          </p>
        </FocusTrap>
      : false;

    return (
      <div>
        <p>
          <button onClick={this.mountTrap}>
            activate trap
          </button>
        </p>
        <p>
          <a href="#">other focusable element</a>
        </p>
        {trap}
      </div>
    );
  }
}

ReactDOM.render(<DemoFour />, container);
