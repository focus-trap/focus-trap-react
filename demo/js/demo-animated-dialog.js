const { useState } = require('react');
const React = require('react');
const { createRoot } = require('react-dom/client');
const { FocusTrap } = require('../../dist/focus-trap-react');

const container = document.getElementById('demo-animated-dialog');

const focusTrapOptions = {
  checkCanFocusTrap: (trapContainers) => {
    const results = trapContainers.map((trapContainer) => {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          if (getComputedStyle(trapContainer).visibility !== 'hidden') {
            resolve();
            clearInterval(interval);
          }
        }, 5);
      });
    });
    // Return a promise that resolves when all the trap containers are able to receive focus
    return Promise.all(results);
  },
  // Called after focus is sent to the focus trap
  onPostActivate: () => {
    // eslint-disable-next-line no-console
    console.log('Focus has been sent to the animated focus trap');
  },
};

const DemoAnimatedDialog = () => {
  const [isTrapActive, setIsTrapActive] = useState(false);

  return (
    <>
      <style>{`
      .animated-dialog {
        position: absolute;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.5s, visibility 0.5s;
      }
      .animated-dialog.is-active {
        opacity: 1;
        visibility: visible;
      }
      `}</style>
      <div>
        <p>
          <button
            onClick={() => setIsTrapActive(true)}
            aria-describedby="animated-dialog-heading"
          >
            activate trap
          </button>
        </p>
      </div>

      <FocusTrap active={isTrapActive} focusTrapOptions={focusTrapOptions}>
        <div
          className={[
            'trap',
            'animated-dialog',
            isTrapActive ? 'is-active' : '',
          ].join(' ')}
        >
          <p>
            Here is a focus trap <a href="#">with</a> <a href="#">some</a>{' '}
            <a href="#">focusable</a> parts.
          </p>
          <p>
            <button
              onClick={() => setIsTrapActive(false)}
              aria-describedby="animated-dialog-heading"
            >
              deactivate trap
            </button>
          </p>
        </div>
      </FocusTrap>
    </>
  );
};

const root = createRoot(container);
root.render(<DemoAnimatedDialog />);
