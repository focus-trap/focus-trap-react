const React = require('react');
const ReactDOM = require('react-dom');
const FocusTrap = require('../../dist/focus-trap-react');

const container = document.getElementById('demo-three');

class DemoThree extends React.Component {
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
    let trapClass = 'trap';
    if (this.state.activeTrap) trapClass += ' is-active';

    return (
      <div>
        <p>
          <button onClick={this.mountTrap}>
            activate trap
          </button>
        </p>
        <FocusTrap
          id="focus-trap-three"
          tag="section"
          style={{ background: '#eee' }}
          data-whatever="nothing"
          active={this.state.activeTrap}
          className={trapClass}
          focusTrapOptions={{
            onDeactivate: this.unmountTrap,
            clickOutsideDeactivates: true
          }}
        >
          <p>
            Here is a focus trap
            {' '}
            <a href="#">with</a>
            {' '}
            <a href="#">some</a>
            {' '}
            <a href="#">focusable</a>
            {' '}
            parts.
          </p>
          <p>
            <button onClick={this.unmountTrap}>
              deactivate trap
            </button>
          </p>
        </FocusTrap>
      </div>
    );
  }
}

ReactDOM.render(<DemoThree />, container);
