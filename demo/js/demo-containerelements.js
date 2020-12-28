const React = require('react');
const ReactDOM = require('react-dom');
const FocusTrap = require('../../dist/focus-trap-react');

const container = document.getElementById('demo-containerelements');

class DemoContainerElements extends React.Component {
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
    const trap = this.state.activeTrap && (
      <FocusTrap
        containerElements={[this.element1, this.element2]}
        focusTrapOptions={{
          onDeactivate: this.unmountTrap,
          allowOutsideClick(event) {
            return event.target.id === 'demo-containerelements-deactivate';
          },
        }}
      >
        {/* NOTE: child is IGNORED in favor of `containerElements` */}
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
              id="demo-containerelements-deactivate"
              onClick={this.unmountTrap}
              aria-label="deactivate trap for 'containerElements' demo"
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
          <button
            onClick={this.mountTrap}
            aria-label="activate trap for 'containerElements' demo"
          >
            activate trap
          </button>
        </p>
        {trap}
      </div>
    );
  }
}

ReactDOM.render(<DemoContainerElements />, container);
