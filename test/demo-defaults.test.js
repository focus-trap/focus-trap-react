const React = require('react');
const {
  render,
  screen,
  fireEvent,
  waitFor,
} = require('@testing-library/react');
const { default: userEvent } = require('@testing-library/user-event');
const DemoDefaults = require('../demo/js/component-examples/demo-defaults');

describe('demo-defaults', () => {
  it('traps keyboard focus when the trap is activated', async () => {
    render(<DemoDefaults />);

    // Activate the focus trap
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

  it('does not return focus to the trigger element when deactivated by default', async () => {
    render(<DemoDefaults />);

    // Activate the focus trap
    fireEvent.click(screen.getByText('activate trap'));

    // Auto-sets focus inside the focus trap
    await waitFor(() => {
      expect(screen.getByText('with')).toHaveFocus();
    });

    // Deactivate the focus trap
    fireEvent.click(screen.getByText('deactivate trap'));

    // Does not return focus to the trigger button
    await waitFor(() => {
      expect(document.body).toHaveFocus();
    });
  });

  it('is deactivated when the user presses the Escape key', async () => {
    render(<DemoDefaults />);

    // Focus trap content is not visible yet
    expect(screen.queryByText(/Here is a focus trap/)).not.toBeInTheDocument();

    // Activate the focus trap
    fireEvent.click(screen.getByText('activate trap'));

    // Focus trap content is visible
    await screen.findByText(/Here is a focus trap/);

    // Deactivate the focus trap using the Escape key
    fireEvent.keyDown(screen.getByText('with'), { key: 'Escape' });

    // Focus trap content is no longer visible
    await waitFor(() => {
      expect(
        screen.queryByText(/Here is a focus trap/)
      ).not.toBeInTheDocument();
    });
  });
});
