const React = require('react');
const {
  render,
  screen,
  fireEvent,
  waitFor,
} = require('@testing-library/react');
const { default: userEvent } = require('@testing-library/user-event');
const FocusTrap = require('../src/focus-trap-react');

class DemoDefaults extends React.Component {
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
    const trap = this.state.activeTrap ? (
      <FocusTrap
        focusTrapOptions={{
          onDeactivate: this.unmountTrap,
        }}
      >
        <div className="trap is-active">
          <p>
            Here is a focus trap <a href="#">with</a> <a href="#">some</a>{' '}
            <a href="#">focusable</a> parts.
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

describe('focus-trap-react', () => {
  it('traps keyboard focus when the trap is activated', async () => {
    render(<DemoDefaults />);

    fireEvent.click(screen.getByText('activate trap'));

    // Auto-sets focus inside the focus trap
    await waitFor(() => {
      expect(screen.getByText('with')).toHaveFocus();
    });

    // Tabbing forward through the focus trap and wrapping back to the beginning
    userEvent.tab();
    expect(screen.getByText('some')).toHaveFocus();

    userEvent.tab();
    expect(screen.getByText('focusable')).toHaveFocus();

    userEvent.tab();
    expect(screen.getByText('deactivate trap')).toHaveFocus();

    userEvent.tab();
    expect(screen.getByText('with')).toHaveFocus();

    // Tabbing backward through the focus trap and wrapping back to the beginning
    userEvent.tab({ shift: true });
    expect(screen.getByText('deactivate trap')).toHaveFocus();

    userEvent.tab({ shift: true });
    expect(screen.getByText('focusable')).toHaveFocus();

    userEvent.tab({ shift: true });
    expect(screen.getByText('some')).toHaveFocus();

    userEvent.tab({ shift: true });
    expect(screen.getByText('with')).toHaveFocus();
  });
});
