const React = require('react');
const ReactDOM = require('react-dom');
const FocusTrap = require('../../dist/focus-trap-react');

const container = document.getElementById('demo-nested');

class DemoNestedTrap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeParentTrap: false,
      activeChildTrap: false,
    };

    this.mountParentTrap = this.mountParentTrap.bind(this);
    this.unmountParentTrap = this.unmountParentTrap.bind(this);
    this.mountChildTrap = this.mountChildTrap.bind(this);
    this.unmountChildTrap = this.unmountChildTrap.bind(this);
  }

  mountParentTrap() {
    this.setState({ activeParentTrap: true });
  }

  unmountParentTrap() {
    this.setState({ activeParentTrap: false });
  }

  mountChildTrap() {
    this.setState({ activeChildTrap: true });
  }

  unmountChildTrap() {
    this.setState({ activeChildTrap: false });
  }

  render() {
    const childTrap = this.state.activeChildTrap
      ? <FocusTrap>
        <div className="trap">
          <button onClick={this.unmountChildTrap}>
            deactivate child trap
          </button>
          <div>
            <a href="#">Another focusable thing</a>
          </div>
        </div>
      </FocusTrap>
      : false;

    const parentTrap = this.state.activeParentTrap
      ? <FocusTrap
          focusTrapOptions={{
            onDeactivate: this.unmountParentTrap
          }}
        >
          <div className="trap">
            <button onClick={this.unmountParentTrap}>
              deactivate parent trap
            </button>
            <div>
              <a href="#">Another focusable thing</a>
            </div>
            <button onClick={this.mountChildTrap}>
              activate child trap
            </button>
            {childTrap}
          </div>
        </FocusTrap>
      : false;

    return (
      <div>
        <p>
          <button key="button" onClick={this.mountParentTrap}>
            activate parent trap
          </button>
        </p>
        {parentTrap}
      </div>
    );
  }
}

ReactDOM.render(<DemoNestedTrap />, container);
