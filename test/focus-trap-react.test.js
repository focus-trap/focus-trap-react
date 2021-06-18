const React = require('react');
const {
  render,
  screen,
  fireEvent,
  waitFor,
} = require('@testing-library/react');
const { default: userEvent } = require('@testing-library/user-event');
const FocusTrap = require('../src/focus-trap-react');

const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const FocusTrapExample = ({ focusTrapOptions, ...otherProps }) => {
  const [trapIsActive, setTrapIsActive] = React.useState(false);

  const mountTrap = () => setTrapIsActive(true);
  const unmountTrap = () => setTrapIsActive(false);

  const trap = (
    <FocusTrap
      focusTrapOptions={{
        onDeactivate: unmountTrap,
        ...focusTrapOptions,
      }}
      {...otherProps}
    >
      <div>
        <p>Some text</p>
        <a href="#">Link 1</a>
        <a href="#">Link 2</a>
        <a href="#">Link 3</a>
        <button onClick={unmountTrap}>deactivate trap</button>
      </div>
    </FocusTrap>
  );

  return (
    <>
      <button onClick={mountTrap}>activate trap</button>
      {trapIsActive && trap}
    </>
  );
};

FocusTrapExample.propTypes = {
  ...FocusTrap.propTypes,
};

describe('FocusTrap', () => {
  beforeEach(() => {
    // This surpresses React error boundary logs for testing intentionally
    // thrown errors, like in some test cases in this suite. See discussion of
    // this here: https://github.com/facebook/react/issues/11098
    jest.spyOn(console, 'error');
    global.console.error.mockImplementation(() => {});
  });

  afterEach(() => {
    global.console.error.mockRestore();
  });

  describe('incorrect children prop usage', () => {
    it('throws an error if a non-element child is passed', () => {
      expect(() => render(<FocusTrap>Child text</FocusTrap>)).toThrowError(
        'expected to receive a single React element child'
      );
    });

    it('throws an error if multiple top-level child elements are passed', () => {
      expect(() =>
        render(
          <FocusTrap>
            <p>Child 1</p>
            <p>Child 2</p>
          </FocusTrap>
        )
      ).toThrowError('expected to receive a single React element child');
    });

    it('throws an error if no focusable child elements are provided', () => {
      expect(() =>
        render(
          <FocusTrap>
            <p>Child 1</p>
          </FocusTrap>
        )
      ).toThrowError(
        'Your focus-trap must have at least one container with at least one tabbable node in it at all times'
      );
    });

    it('throws an error if no container child element surrounds the tabbable content', () => {
      expect(() =>
        render(
          <FocusTrap>
            <button>Click me</button>
          </FocusTrap>
        )
      ).toThrowError(
        'Your focus-trap must have at least one container with at least one tabbable node in it at all times'
      );
    });

    it('throws an error if a fragment is given as the child element', () => {
      expect(() =>
        render(
          <FocusTrap>
            <>
              <button>Click me</button>
            </>
          </FocusTrap>
        )
      ).toThrowError(
        'A focus-trap cannot use a Fragment as its child container. Try replacing it with a <div> element.'
      );
    });
  });

  describe('correct children prop usage', () => {
    it('allows a single child element prop to be passed', () => {
      expect(() =>
        render(
          <FocusTrap>
            <div>
              <button>Child text</button>
            </div>
          </FocusTrap>
        )
      ).not.toThrowError('expected to receive a single React element child');
    });

    it('allows no children prop to be passed', () => {
      expect(() => render(<FocusTrap />)).not.toThrowError(
        'expected to receive a single React element child'
      );
    });

    it('preserves the child ref when it is a function', () => {
      const childRef = jest.fn();

      render(
        <FocusTrap>
          <div ref={childRef}>
            <button>Child text</button>
          </div>
        </FocusTrap>
      );

      expect(childRef).toHaveBeenCalledTimes(1);
    });

    it('preserves the child ref when it is an object containing a `current` property', () => {
      const ChildRefExample = () => {
        const childRef = React.useRef(null);

        return (
          <FocusTrap>
            <div ref={childRef}>
              <button onClick={() => expect(childRef.current).not.toBeNull()}>
                Child text
              </button>
            </div>
          </FocusTrap>
        );
      };

      render(<ChildRefExample />);

      fireEvent.click(screen.getByText('Child text'));
    });
  });

  describe('default behaviors', () => {
    it('traps keyboard focus when the trap is activated', async () => {
      render(<FocusTrapExample />);

      // Activate the focus trap
      const activateTrapButton = screen.getByText('activate trap');
      activateTrapButton.focus();
      fireEvent.click(activateTrapButton);

      // Auto-sets focus inside the focus trap
      await waitFor(() => {
        expect(screen.getByText('Link 1')).toHaveFocus();
      });

      const link1 = screen.getByText('Link 1');
      const link2 = screen.getByText('Link 2');
      const link3 = screen.getByText('Link 3');
      const deactivateTrapButton = screen.getByText('deactivate trap');

      // Tabbing forward through the focus trap and wrapping back to the beginning
      userEvent.tab();
      expect(link2).toHaveFocus();

      userEvent.tab();
      expect(link3).toHaveFocus();

      userEvent.tab();
      expect(deactivateTrapButton).toHaveFocus();

      userEvent.tab();
      expect(link1).toHaveFocus();

      // Tabbing backward through the focus trap and wrapping back to the beginning
      userEvent.tab({ shift: true });
      expect(deactivateTrapButton).toHaveFocus();

      userEvent.tab({ shift: true });
      expect(link3).toHaveFocus();

      userEvent.tab({ shift: true });
      expect(link2).toHaveFocus();

      userEvent.tab({ shift: true });
      expect(link1).toHaveFocus();
    });

    it('returns focus to the trigger element when deactivated', async () => {
      render(<FocusTrapExample />);

      // Activate the focus trap
      const activateTrapButton = screen.getByText('activate trap');
      activateTrapButton.focus();
      fireEvent.click(activateTrapButton);

      // Auto-sets focus inside the focus trap
      await waitFor(() => {
        expect(screen.getByText('Link 1')).toHaveFocus();
      });

      // Deactivate the focus trap
      fireEvent.click(screen.getByText('deactivate trap'));

      // Returns focus to the trigger button
      await waitFor(() => {
        expect(activateTrapButton).toHaveFocus();
      });
    });

    it('is deactivated when the user presses the Escape key', async () => {
      render(<FocusTrapExample />);

      // Focus trap content is not visible yet
      expect(screen.queryByText('Link 1')).not.toBeInTheDocument();

      // Activate the focus trap
      const activateTrapButton = screen.getByText('activate trap');
      activateTrapButton.focus();
      fireEvent.click(activateTrapButton);

      // Focus trap content is visible
      await screen.findByText('Link 1');

      // Deactivate the focus trap using the Escape key
      fireEvent.keyDown(screen.getByText('Link 1'), { key: 'Escape' });

      // Focus trap content is no longer visible
      await waitFor(() => {
        expect(screen.queryByText('Link 1')).not.toBeInTheDocument();
      });
    });
  });

  describe('focusTrapOptions', () => {
    it('is not deactivated when the user presses the Escape key if escapeDeactivates=false', async () => {
      render(
        <FocusTrapExample focusTrapOptions={{ escapeDeactivates: false }} />
      );

      // Focus trap content is not visible yet
      expect(screen.queryByText('Link 1')).not.toBeInTheDocument();

      // Activate the focus trap
      const activateTrapButton = screen.getByText('activate trap');
      activateTrapButton.focus();
      fireEvent.click(activateTrapButton);

      // Focus trap content is visible
      await screen.findByText('Link 1');

      // Attempt to deactivate the focus trap using the Escape key
      fireEvent.keyDown(screen.getByText('Link 1'), { key: 'Escape' });

      // Focus trap content is still visible
      expect(screen.getByText('Link 1')).toBeInTheDocument();

      // Deactivate the focus trap by clicking the deactivate button
      fireEvent.click(screen.getByText('deactivate trap'));

      // Focus trap content is no longer visible
      await waitFor(() => {
        expect(screen.queryByText('Link 1')).not.toBeInTheDocument();
      });
    });

    it('does not return focus to the trigger button when the trap deactivates if returnFocusOnDeactivate=false', async () => {
      render(
        <FocusTrapExample
          focusTrapOptions={{ returnFocusOnDeactivate: false }}
        />
      );

      // Activate the focus trap
      const activateTrapButton = screen.getByText('activate trap');
      activateTrapButton.focus();
      fireEvent.click(activateTrapButton);

      // Auto-sets focus inside the focus trap
      await waitFor(() => {
        expect(screen.getByText('Link 1')).toHaveFocus();
      });

      // Deactivate the focus trap
      fireEvent.click(screen.getByText('deactivate trap'));

      // Does not return focus to the trigger button
      await waitFor(() => {
        expect(document.body).toHaveFocus();
      });
    });

    it('Does not call onPostActivate() until checkCanFocusTrap() has completed', async () => {
      const onActivate = jest.fn();
      const onPostActivate = jest.fn();

      render(
        <FocusTrapExample
          focusTrapOptions={{
            checkCanFocusTrap: () => pause(5),
            onActivate,
            onPostActivate,
          }}
        />
      );

      expect(onActivate).not.toHaveBeenCalled();
      expect(onPostActivate).not.toHaveBeenCalled();

      // Activate the focus trap
      const activateTrapButton = screen.getByText('activate trap');
      activateTrapButton.focus();
      fireEvent.click(activateTrapButton);

      expect(onActivate).toHaveBeenCalled();
      expect(onPostActivate).not.toHaveBeenCalled();

      await pause(3);

      expect(onActivate).toHaveBeenCalled();
      expect(onPostActivate).not.toHaveBeenCalled();

      await pause(6);

      expect(onActivate).toHaveBeenCalled();
      expect(onPostActivate).toHaveBeenCalled();
    });

    it('Does not call onPostDeactivate() until checkCanReturnFocus() has completed', async () => {
      const onDeactivate = jest.fn();
      const onPostDeactivate = jest.fn();

      render(
        <FocusTrapExample
          focusTrapOptions={{
            checkCanReturnFocus: () => pause(5),
            onDeactivate,
            onPostDeactivate,
          }}
        />
      );

      // Activate the focus trap
      const activateTrapButton = screen.getByText('activate trap');
      activateTrapButton.focus();
      fireEvent.click(activateTrapButton);

      // Auto-sets focus inside the focus trap
      await waitFor(() => {
        expect(screen.getByText('Link 1')).toHaveFocus();
      });

      expect(onDeactivate).not.toHaveBeenCalled();
      expect(onPostDeactivate).not.toHaveBeenCalled();

      // Deactivate the focus trap
      fireEvent.click(screen.getByText('deactivate trap'));

      expect(onDeactivate).toHaveBeenCalled();
      expect(onPostDeactivate).not.toHaveBeenCalled();

      await pause(3);

      expect(onDeactivate).toHaveBeenCalled();
      expect(onPostDeactivate).not.toHaveBeenCalled();

      await pause(6);

      expect(onDeactivate).toHaveBeenCalled();
      expect(onPostDeactivate).toHaveBeenCalled();
    });

    it('Will call onPostActivate() even if checkCanFocusTrap() is undefined', async () => {
      const onActivate = jest.fn();
      const onPostActivate = jest.fn();

      render(
        <FocusTrapExample
          focusTrapOptions={{
            onActivate,
            onPostActivate,
          }}
        />
      );

      expect(onActivate).not.toHaveBeenCalled();
      expect(onPostActivate).not.toHaveBeenCalled();

      // Activate the focus trap
      const activateTrapButton = screen.getByText('activate trap');
      activateTrapButton.focus();
      fireEvent.click(activateTrapButton);

      expect(onActivate).toHaveBeenCalled();
      expect(onPostActivate).toHaveBeenCalled();
    });

    it('Will call onPostDeactivate() even if checkCanReturnFocus() is undefined', async () => {
      const onDeactivate = jest.fn();
      const onPostDeactivate = jest.fn();

      render(
        <FocusTrapExample
          focusTrapOptions={{
            onDeactivate,
            onPostDeactivate,
          }}
        />
      );

      // Activate the focus trap
      const activateTrapButton = screen.getByText('activate trap');
      activateTrapButton.focus();
      fireEvent.click(activateTrapButton);

      // Auto-sets focus inside the focus trap
      await waitFor(() => {
        expect(screen.getByText('Link 1')).toHaveFocus();
      });

      expect(onDeactivate).not.toHaveBeenCalled();
      expect(onPostDeactivate).not.toHaveBeenCalled();

      // Deactivate the focus trap
      fireEvent.click(screen.getByText('deactivate trap'));

      expect(onDeactivate).toHaveBeenCalled();
      expect(onPostDeactivate).toHaveBeenCalled();
    });

    it('Will call onPostDeactivate() even if returnFocusOnDeactivate is false', async () => {
      const onDeactivate = jest.fn();
      const onPostDeactivate = jest.fn();

      render(
        <FocusTrapExample
          focusTrapOptions={{
            onDeactivate,
            onPostDeactivate,
            returnFocusOnDeactivate: false,
          }}
        />
      );

      // Activate the focus trap
      const activateTrapButton = screen.getByText('activate trap');
      activateTrapButton.focus();
      fireEvent.click(activateTrapButton);

      // Auto-sets focus inside the focus trap
      await waitFor(() => {
        expect(screen.getByText('Link 1')).toHaveFocus();
      });

      expect(onDeactivate).not.toHaveBeenCalled();
      expect(onPostDeactivate).not.toHaveBeenCalled();

      // Deactivate the focus trap
      fireEvent.click(screen.getByText('deactivate trap'));

      expect(onDeactivate).toHaveBeenCalled();
      expect(onPostDeactivate).toHaveBeenCalled();
    });

    ['string', 'element', 'function'].forEach((elementSelectionMethod) => {
      it(`Will return focus to setReturnFocus target, setReturnFocus type = ${elementSelectionMethod}`, async () => {
        render(<div data-testid="AlternateReturnFocusElement" tabIndex={-1} />);

        const selectionMethods = {
          string: '[data-testid="AlternateReturnFocusElement"]',
          element: screen.getByTestId('AlternateReturnFocusElement'),
          function: () => screen.getByTestId('AlternateReturnFocusElement'),
        };

        render(
          <FocusTrapExample
            focusTrapOptions={{
              setReturnFocus: selectionMethods[elementSelectionMethod],
            }}
          />
        );

        // Activate the focus trap
        const activateTrapButton = screen.getByText('activate trap');
        activateTrapButton.focus();
        fireEvent.click(activateTrapButton);

        // Auto-sets focus inside the focus trap
        await waitFor(() => {
          expect(screen.getByText('Link 1')).toHaveFocus();
        });

        // Deactivate the focus trap
        const deactivateTrapButton = screen.getByText('deactivate trap');
        deactivateTrapButton.focus();
        fireEvent.click(deactivateTrapButton);

        await waitFor(() => {
          expect(
            screen.getByTestId('AlternateReturnFocusElement')
          ).toHaveFocus();
        });
      });
    });
  });

  describe('containerElements prop', () => {
    it('uses specified elements as the focus trap content when the containerElements prop is provided', async () => {
      const container1 = document.createElement('div');
      const anchor1 = document.createElement('a');
      const anchorText1 = document.createTextNode('Anchor 1');
      anchor1.setAttribute('href', '#');
      anchor1.appendChild(anchorText1);
      container1.appendChild(anchor1);
      document.body.appendChild(container1);

      const container2 = document.createElement('div');
      const anchor2 = document.createElement('a');
      const anchorText2 = document.createTextNode('Anchor 2');
      anchor2.setAttribute('href', '#');
      anchor2.appendChild(anchorText2);
      container2.appendChild(anchor2);
      document.body.appendChild(container2);

      render(<FocusTrapExample containerElements={[container1, container2]} />);

      // Activate the focus trap
      const activateTrapButton = screen.getByText('activate trap');
      activateTrapButton.focus();
      fireEvent.click(activateTrapButton);

      // Auto-sets focus inside the focus trap
      await waitFor(() => {
        expect(anchor1).toHaveFocus();
      });

      // Tabbing forward through the focus trap and wrapping back to the beginning
      userEvent.tab();
      expect(anchor2).toHaveFocus();

      userEvent.tab();
      expect(anchor1).toHaveFocus();

      // Tabbing backward through the focus trap and wrapping back to the beginning
      userEvent.tab({ shift: true });
      expect(anchor2).toHaveFocus();

      userEvent.tab({ shift: true });
      expect(anchor1).toHaveFocus();

      // DOM cleanup
      container1.remove();
      container2.remove();
    });

    it('does not activate the focus trap when the containerElements prop is provided with null values', async () => {
      render(
        <>
          <FocusTrapExample containerElements={[]} />
          <button>after trap content</button>
        </>
      );

      // Attempt to activate the focus trap
      const activateTrapButton = screen.getByText('activate trap');
      activateTrapButton.focus();
      fireEvent.click(activateTrapButton);

      // Does not activate the focus trap or change which element is currently focused
      expect(activateTrapButton).toHaveFocus();

      userEvent.tab();
      expect(screen.getByText('Link 1')).toHaveFocus();

      userEvent.tab();
      expect(screen.getByText('Link 2')).toHaveFocus();

      userEvent.tab();
      expect(screen.getByText('Link 3')).toHaveFocus();

      userEvent.tab();
      expect(screen.getByText('deactivate trap')).toHaveFocus();

      // Because the focus trap is not activated, the tab order continues past the trap content
      userEvent.tab();
      expect(screen.getByText('after trap content')).toHaveFocus();
    });

    it('updates the focus trap when the containerElements prop values changes', async () => {
      const container1 = document.createElement('div');
      const anchor1 = document.createElement('a');
      const anchorText1 = document.createTextNode('Anchor 1');
      anchor1.setAttribute('href', '#');
      anchor1.appendChild(anchorText1);
      container1.appendChild(anchor1);
      document.body.appendChild(container1);

      const container2 = document.createElement('div');
      const anchor2 = document.createElement('a');
      const anchorText2 = document.createTextNode('Anchor 2');
      anchor2.setAttribute('href', '#');
      anchor2.appendChild(anchorText2);
      container2.appendChild(anchor2);
      document.body.appendChild(container2);

      const ChangingContainerElementsExample = () => {
        const [containerElements, setContainerElements] = React.useState([]);

        const useTwoContainerElements = () =>
          setContainerElements([container1, container2]);
        const useOneContainerElement = () => setContainerElements([container1]);
        const useZeroContainerElements = () => setContainerElements([]);

        const allowOutsideClick = (e) =>
          e.target.id === 'use-zero-container-elements-button';

        return (
          <>
            <FocusTrapExample
              containerElements={containerElements}
              focusTrapOptions={{ allowOutsideClick }}
            />
            <button onClick={useTwoContainerElements}>
              use two container elements
            </button>
            <button onClick={useOneContainerElement}>
              use one container element
            </button>
            <button
              id="use-zero-container-elements-button"
              onClick={useZeroContainerElements}
            >
              use zero container elements
            </button>
          </>
        );
      };

      render(<ChangingContainerElementsExample />);

      // Attempt to activate the focus trap
      const activateTrapButton = screen.getByText('activate trap');
      activateTrapButton.focus();
      fireEvent.click(activateTrapButton);

      // Does not activate the focus trap or change which element is currently focused
      expect(activateTrapButton).toHaveFocus();

      userEvent.tab();
      expect(screen.getByText('Link 1')).toHaveFocus();

      userEvent.tab();
      expect(screen.getByText('Link 2')).toHaveFocus();

      userEvent.tab();
      expect(screen.getByText('Link 3')).toHaveFocus();

      userEvent.tab();
      expect(screen.getByText('deactivate trap')).toHaveFocus();

      userEvent.tab();
      const useTwoContainerElementsButton = screen.getByText(
        'use two container elements'
      );
      expect(useTwoContainerElementsButton).toHaveFocus();

      // Updates the containerElements prop value to contain two elements, but does not activate the focus trap yet
      fireEvent.click(useTwoContainerElementsButton);
      expect(useTwoContainerElementsButton).toHaveFocus();

      // Activate the focus trap
      activateTrapButton.focus();
      fireEvent.click(activateTrapButton);

      // Auto-sets focus inside the focus trap
      await waitFor(() => {
        expect(anchor1).toHaveFocus();
      });

      // Tabbing forward through the focus trap and wrapping back to the beginning
      userEvent.tab();
      expect(anchor2).toHaveFocus();

      userEvent.tab();
      expect(anchor1).toHaveFocus();

      // Tabbing backward through the focus trap and wrapping back to the beginning
      userEvent.tab({ shift: true });
      expect(anchor2).toHaveFocus();

      userEvent.tab({ shift: true });
      expect(anchor1).toHaveFocus();

      // Updates the containerElements prop value to contain zero elements,
      // which throws an error because the focus trap must contain at least one tabbable element
      const useZeroContainerElementsButton = screen.getByText(
        'use zero container elements'
      );
      expect(() =>
        fireEvent.click(useZeroContainerElementsButton)
      ).toThrowError(
        'Your focus-trap must have at least one container with at least one tabbable node in it at all times'
      );

      // DOM cleanup
      container1.remove();
      container2.remove();
    });
  });

  describe('always-present focus traps', () => {
    it('can be activated and deactivated while still on the screen', async () => {
      const AlwaysPresentFocusTrapExample = ({
        focusTrapOptions,
        ...otherProps
      }) => {
        const [trapIsActive, setTrapIsActive] = React.useState(false);

        const activateTrap = () => setTrapIsActive(true);
        const deactivateTrap = () => setTrapIsActive(false);

        const trap = (
          <FocusTrap
            active={trapIsActive}
            focusTrapOptions={{
              onActivate: activateTrap,
              onDeactivate: deactivateTrap,
              ...focusTrapOptions,
            }}
            {...otherProps}
          >
            <div>
              <p>Some text</p>
              <a href="#">Link 1</a>
              <a href="#">Link 2</a>
              <a href="#">Link 3</a>
              <button onClick={deactivateTrap}>deactivate trap</button>
            </div>
          </FocusTrap>
        );

        return (
          <>
            <button onClick={activateTrap}>activate trap</button>
            <button>before trap content</button>
            {trap}
            <button>after trap content</button>
          </>
        );
      };

      AlwaysPresentFocusTrapExample.propTypes = {
        ...FocusTrap.propTypes,
      };

      render(<AlwaysPresentFocusTrapExample />);

      const activateTrapButton = screen.getByText('activate trap');
      const beforeTrapContentButton = screen.getByText('before trap content');
      const link1 = screen.getByText('Link 1');
      const link2 = screen.getByText('Link 2');
      const link3 = screen.getByText('Link 3');
      const deactivateTrapButton = screen.getByText('deactivate trap');
      const afterTrapContentButton = screen.getByText('after trap content');

      // Tab through the page while the trap is deactivated
      userEvent.tab();
      expect(activateTrapButton).toHaveFocus();

      userEvent.tab();
      expect(beforeTrapContentButton).toHaveFocus();

      userEvent.tab();
      expect(link1).toHaveFocus();

      userEvent.tab();
      expect(link2).toHaveFocus();

      userEvent.tab();
      expect(link3).toHaveFocus();

      userEvent.tab();
      expect(deactivateTrapButton).toHaveFocus();

      userEvent.tab();
      expect(afterTrapContentButton).toHaveFocus();

      userEvent.tab();
      expect(document.body).toHaveFocus();

      // Activate the focus trap
      activateTrapButton.focus();
      fireEvent.click(activateTrapButton);

      // Auto-sets focus inside the focus trap
      await waitFor(() => {
        expect(link1).toHaveFocus();
      });

      // Tab through the page while the trap is activated
      userEvent.tab();
      expect(link2).toHaveFocus();

      userEvent.tab();
      expect(link3).toHaveFocus();

      userEvent.tab();
      expect(deactivateTrapButton).toHaveFocus();

      userEvent.tab();
      expect(link1).toHaveFocus();

      // Deactivate the focus trap
      fireEvent.click(deactivateTrapButton);

      // Returns focus to the trigger button
      await waitFor(() => {
        expect(activateTrapButton).toHaveFocus();
      });
    });

    it('can be paused and unpaused while still on the screen', async () => {
      const PausableFocusTrapExample = ({
        focusTrapOptions,
        ...otherProps
      }) => {
        const [trapIsActive, setTrapIsActive] = React.useState(false);
        const [trapIsPaused, setTrapIsPaused] = React.useState(false);

        const activateTrap = () => setTrapIsActive(true);
        const deactivateTrap = () => setTrapIsActive(false);

        const pauseTrap = () => setTrapIsPaused(true);
        const unpauseTrap = () => setTrapIsPaused(false);

        const trap = (
          <FocusTrap
            active={trapIsActive}
            paused={trapIsPaused}
            focusTrapOptions={{
              onActivate: activateTrap,
              onDeactivate: deactivateTrap,
              ...focusTrapOptions,
            }}
            {...otherProps}
          >
            <div>
              <p>Some text</p>
              <a href="#">Link 1</a>
              <a href="#">Link 2</a>
              <a href="#">Link 3</a>
              <button onClick={deactivateTrap}>deactivate trap</button>
              <button onClick={pauseTrap}>pause trap</button>
            </div>
          </FocusTrap>
        );

        return (
          <>
            <button onClick={activateTrap}>activate trap</button>
            {trap}
            <button>after trap content</button>
            <button onClick={unpauseTrap}>unpause trap</button>
          </>
        );
      };

      PausableFocusTrapExample.propTypes = {
        ...FocusTrap.propTypes,
      };

      render(<PausableFocusTrapExample />);

      const activateTrapButton = screen.getByText('activate trap');
      const unpauseTrapButton = screen.getByText('unpause trap');
      const link1 = screen.getByText('Link 1');
      const link2 = screen.getByText('Link 2');
      const link3 = screen.getByText('Link 3');
      const deactivateTrapButton = screen.getByText('deactivate trap');
      const pauseTrapButton = screen.getByText('pause trap');
      const afterTrapContentButton = screen.getByText('after trap content');

      // Activate the focus trap
      activateTrapButton.focus();
      fireEvent.click(activateTrapButton);

      // Auto-sets focus inside the focus trap
      await waitFor(() => {
        expect(link1).toHaveFocus();
      });

      // Tab through the page while the trap is activated
      userEvent.tab();
      expect(link2).toHaveFocus();

      userEvent.tab();
      expect(link3).toHaveFocus();

      userEvent.tab();
      expect(deactivateTrapButton).toHaveFocus();

      userEvent.tab();
      expect(pauseTrapButton).toHaveFocus();

      // Pause the focus trap
      fireEvent.click(pauseTrapButton);

      userEvent.tab();
      expect(afterTrapContentButton).toHaveFocus();

      userEvent.tab();
      expect(unpauseTrapButton).toHaveFocus();

      // Unpause the focus trap
      fireEvent.click(unpauseTrapButton);

      // Auto-sets focus inside the focus trap
      await waitFor(() => {
        expect(link1).toHaveFocus();
      });
    });
  });
});
