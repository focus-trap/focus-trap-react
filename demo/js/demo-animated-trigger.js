const { useState } = require('react');
const React = require('react');
const { createRoot } = require('react-dom/client');
const FocusTrap = require('../../dist/focus-trap-react');

const container = document.getElementById('demo-animated-trigger');

const focusTrapOptions = {
  // There is a delay between when the class is removed
  // and when the trigger is focusable
  checkCanReturnFocus: (triggerButton) => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (getComputedStyle(triggerButton).visibility !== 'hidden') {
          resolve();
          clearInterval(interval);
        }
      }, 5);
    });
  },
  // Called after focus is sent to the trigger button
  onPostDeactivate: () => {
    // eslint-disable-next-line no-console
    console.log(
      'Focus has been sent to the animated focus trap trigger button'
    );
  },
};

const DemoAnimatedTrigger = () => {
  const [isTrapActive, setIsTrapActive] = useState(false);

  return (
    <>
      <style>{`
      .animated-trigger {
        transition: opacity 0.5s, visibility 0.5s;
      }
      .animated-trigger.is-active {
        opacity: 0;
        visibility: hidden;
      }
      `}</style>
      <div>
        <p>
          <button
            className={[
              'animated-trigger',
              isTrapActive ? 'is-active' : '',
            ].join(' ')}
            onClick={() => setIsTrapActive(true)}
            aria-describedby="animated-trigger-heading"
          >
            activate trap
          </button>
        </p>
      </div>

      <FocusTrap active={isTrapActive} focusTrapOptions={focusTrapOptions}>
        <div className={['trap', isTrapActive ? 'is-active' : ''].join(' ')}>
          <p>
            Here is a focus trap <a href="#">with</a> <a href="#">some</a>{' '}
            <a href="#">focusable</a> parts.
          </p>
          <p>
            <button
              onClick={() => setIsTrapActive(false)}
              aria-describedby="animated-trigger-heading"
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
root.render(<DemoAnimatedTrigger />);
