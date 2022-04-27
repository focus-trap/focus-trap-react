const { useState, useMemo } = require('react');
const React = require('react');
const { createRoot } = require('react-dom/client');
const FocusTrap = require('../../dist/focus-trap-react');

const container = document.getElementById('demo-setReturnFocus');

const DemoSetReturnFocusDialog = () => {
  const [isTrapActive, setIsTrapActive] = useState(false);

  const focusTrapOptions = useMemo(
    () => ({
      setReturnFocus: '#AlternateReturnFocusElement',
      onDeactivate: () => setIsTrapActive(false),
    }),
    []
  );

  return (
    <>
      <div>
        <p>
          <button
            onClick={() => setIsTrapActive(true)}
            aria-describedby="setReturnFocus-heading"
          >
            activate trap
          </button>
          <button id="AlternateReturnFocusElement" onClick={() => {}}>
            Alternate Return Focus Element
          </button>
        </p>
      </div>

      {isTrapActive && (
        <FocusTrap focusTrapOptions={focusTrapOptions}>
          <div className="trap is-active">
            <p>
              Here is a focus trap <a href="#">with</a> <a href="#">some</a>{' '}
              <a href="#">focusable</a> parts.
            </p>
            <p>
              <button
                onClick={() => setIsTrapActive(false)}
                aria-describedby="setReturnFocus-heading"
              >
                deactivate trap
              </button>
            </p>
          </div>
        </FocusTrap>
      )}
    </>
  );
};

const root = createRoot(container);
root.render(<DemoSetReturnFocusDialog />);
