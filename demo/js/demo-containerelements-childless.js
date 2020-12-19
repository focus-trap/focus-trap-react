const React = require('react');
const ReactDOM = require('react-dom');
const FocusTrap = require('../../dist/focus-trap-react');

const container = document.getElementById('demo-containerelements-childless');

class DemoContainerElementsChildless extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTrap: false,
    };

    this.mountTrap = this.mountTrap.bind(this);
    this.unmountTrap = this.unmountTrap.bind(this);
    this.setElementRef = this.setElementRef.bind(this);

    this.element1 = null;
    this.element2 = null;
  }

  mountTrap() {
    this.setState({ activeTrap: true });
  }

  unmountTrap() {
    this.setState({ activeTrap: false });
  }

  setElementRef(refName) {
    return (element) => {
      if (element && (!this[refName] || this[refName] !== element)) {
        this[refName] = element;
        this.forceUpdate(); // re-render
      }
    };
  }

  render() {
    const trap = this.state.activeTrap ? (
      <>
        <FocusTrap
          containerElements={[this.element1, this.element2]}
          focusTrapOptions={{
            onDeactivate: this.unmountTrap,
            allowOutsideClick(event) {
              return (
                event.target.id ===
                'demo-containerelements-childless-deactivate'
              );
            },
          }}
        />

        <div className="trap is-active">
          <p ref={this.setElementRef('element1')}>
            Here is a focus trap <a href="#">with</a> <a href="#">some</a>{' '}
            <a href="#">focusable</a> parts.
          </p>
          <p>
            Here is <a href="#">something</a>.
          </p>
          <p ref={this.setElementRef('element2')}>
            Here is a another focus trap element. <a href="#">See</a>{' '}
            <a href="#">how</a> it <a href="#">works</a>.
          </p>
          <p>
            <button
              id="demo-containerelements-childless-deactivate"
              onClick={this.unmountTrap}
            >
              deactivate trap
            </button>
          </p>
        </div>
      </>
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

ReactDOM.render(<DemoContainerElementsChildless />, container);
