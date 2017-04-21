const React = require('react');
const ReactDOM = require('react-dom');
const FocusTrap = require('../../dist/focus-trap-react');

const container = document.getElementById('demo-five');

class DemoFive extends React.Component {
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
          focusTrapOptions={{
            onDeactivate: this.unmountTrap
          }}
        >
          <div className="trap">
            <button onClick={this.unmountTrap}>
              deactivate trap
            </button>
            <div>
              <a href="#">Another focusable thing</a>
            </div>
            <div>
              Autofocused input: <input autoFocus={true} />
            </div>
          </div>
        </FocusTrap>
      : false;

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

ReactDOM.render(<DemoFive />, container);
