const React = require('react');
const {
  render,
  screen,
  fireEvent,
  waitFor,
} = require('@testing-library/react');
const { default: userEvent } = require('@testing-library/user-event');
const DemoSpecialElement = require('../demo/js/component-examples/demo-special-element');

describe('demo-special-element', () => {
  it('traps keyboard focus when the trap is activated', async () => {
    render(<DemoSpecialElement />);

    // Activate the focus trap
    screen.getByText('activate trap').focus();
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

  it('returns focus to the trigger element when deactivated when returnFocusOnDeactivate prop is set to true', async () => {
    render(<DemoSpecialElement />);

    // Activate the focus trap
    screen.getByText('activate trap').focus();
    fireEvent.click(screen.getByText('activate trap'));

    // Auto-sets focus inside the focus trap
    await waitFor(() => {
      expect(screen.getByText('with')).toHaveFocus();
    });

    // Deactivate the focus trap
    fireEvent.click(screen.getByText('deactivate trap'));

    // Returns focus to the trigger button
    await waitFor(() => {
      expect(screen.getByText('activate trap')).toHaveFocus();
    });
  });

  it('deactivates the focus trap and passes the click through when the user clicks anywhere outside the focus trap content if the clickOutsideDeactivates prop is set to true', async () => {
    render(<DemoSpecialElement />);

    // Activate the focus trap
    fireEvent.click(screen.getByText('activate trap'));

    // Deactivate the focus trap by clicking somewhere else
    fireEvent.click(screen.getByText('pass thru click'));

    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
