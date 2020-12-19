const React = require('react');
const {
  render,
  screen,
  fireEvent,
  waitFor,
} = require('@testing-library/react');
const DemoFfne = require('./component-examples/demo-ffne');

describe('demo-first-focus-no-escape', () => {
  it('sets the focus to the element specified by the initialFocus option', async () => {
    render(<DemoFfne />);

    // Activate the focus trap
    screen.getByText('activate trap').focus();
    fireEvent.click(screen.getByText('activate trap'));

    // Sets focus to the specified element
    await waitFor(() => {
      expect(screen.getByLabelText('Initially focused input')).toHaveFocus();
    });
  });

  it('is not deactivated when the user presses the Escape key if the escapeDeactivates option is set to false', async () => {
    render(<DemoFfne />);

    // Focus trap content is not visible yet
    expect(screen.queryByText(/Here is a focus trap/)).not.toBeInTheDocument();

    // Activate the focus trap
    screen.getByText('activate trap').focus();
    fireEvent.click(screen.getByText('activate trap'));

    // Focus trap content is visible
    await screen.findByText(/Here is a focus trap/);

    // Attempt to deactivate the focus trap using the Escape key
    fireEvent.keyDown(screen.getByText('with'), { key: 'Escape' });

    // Focus trap content is still visible
    expect(screen.getByText(/Here is a focus trap/)).toBeInTheDocument();

    // Deactivate the focus trap by clicking the deactivate button
    fireEvent.click(screen.getByText('deactivate trap'));

    // Focus trap content is no longer visible
    await waitFor(() => {
      expect(
        screen.queryByText(/Here is a focus trap/)
      ).not.toBeInTheDocument();
    });
  });
});
