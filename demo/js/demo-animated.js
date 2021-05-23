const { useState } = require('react');
const React = require('react');
const ReactDOM = require('react-dom');
const FocusTrap = require('../../dist/focus-trap-react');

const container = document.getElementById('demo-animated');

const focusTrapOptions = {
  checkCanActivate: (elem) => getComputedStyle(elem).visibility !== 'hidden',
};

const DemoAnimated = () => {
  const [isTrapActive, setIsTrapActive] = useState(false);

  return (
    <>
      <style>{`
      .DemoAnimatedTrap {
        position: absolute;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.5s, visibility 0.5s;
      }
      .DemoAnimatedTrap.is-active {
        opacity: 1;
        visibility: visible;
      }
      `}</style>
      <div>
        <p>
          <button
            onClick={() => setIsTrapActive(true)}
            aria-label="activate trap for 'fading' demo"
          >
            activate trap
          </button>
        </p>
      </div>

      <FocusTrap active={isTrapActive} focusTrapOptions={focusTrapOptions}>
        <div
          className={[
            'trap',
            'DemoAnimatedTrap',
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
              aria-label="deactivate trap for 'defaults' demo"
            >
              deactivate trap
            </button>
          </p>
        </div>
      </FocusTrap>
    </>
  );
};

ReactDOM.render(<DemoAnimated />, container);
