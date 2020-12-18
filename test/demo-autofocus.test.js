const React = require('react');
const {
  render,
  screen,
  fireEvent,
  waitFor,
} = require('@testing-library/react');
const DemoAutofocus = require('../demo/js/component-examples/demo-autofocus');

describe('demo-autofocus', () => {
  it('allows the focus to immediately go to the autofocusable element inside the focus trap', async () => {
    render(<DemoAutofocus />);

    // Activate the focus trap
    fireEvent.click(screen.getByText('activate trap'));

    // Auto-sets focus inside the focus trap
    await waitFor(() => {
      expect(screen.getByTestId('autofocus-el')).toHaveFocus();
    });
  });
});
