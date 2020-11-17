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

    this.elementRef1 = React.createRef();
    this.elementRef2 = React.createRef();
  }

  mountTrap() {
    this.setState({ activeTrap: true });
  }

  unmountTrap() {
    this.setState({ activeTrap: false });
  }

  setElementRef(refName) {
    return (element) => {
      if (!this[refName].current) {
        this[refName].current = element;
        this.forceUpdate();
      }
    };
  }

  render() {
    const trap = this.state.activeTrap ? (
      <FocusTrap
        containerElements={[this.elementRef1.current, this.elementRef2.current]}
        focusTrapOptions={{
          onDeactivate: this.unmountTrap,
          clickOutsideDeactivates: true,
        }}
      >
        <div className="trap is-active">
          <p ref={this.setElementRef('elementRef1')}>
            Here is a focus trap <a href="#">with</a> <a href="#">some</a>
            <a href="#">focusable</a> parts.
          </p>
          <p>
            Here is <a href="#">something</a>.
          </p>
          <p ref={this.setElementRef('elementRef2')}>
            Here is a another focus trap element. <a href="#">See</a>{' '}
            <a href="#">how</a>
            it <a href="#">works</a>.
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

ReactDOM.render(<DemoContainerElements />, container);
