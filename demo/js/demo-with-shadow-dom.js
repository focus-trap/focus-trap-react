const React = require('react');
const ReactDOM = require('react-dom');
const FocusTrap = require('../../dist/focus-trap-react');

const createShadow = function (hostEl, isOpen) {
  const containerEl = document.createElement('div');
  containerEl.id = 'with-shadow-dom-closed-container';
  containerEl.style = `border: 1px dotted black; margin-top: 10px; padding: 10px; background-color: ${
    isOpen ? 'transparent' : 'rgba(0, 0, 0, 0.05)'
  };`;
  containerEl.innerHTML = `
    <p style="margin-top: 0; padding-top: 0;">
      This field is inside a <strong>${
        isOpen ? 'opened' : 'closed'
      }</strong> Shadow DOM:
    </p>
    <input id="text-input" type="text" />
  `;

  // use same styles as host
  const styleLinkEl = document.createElement('link');
  styleLinkEl.setAttribute('rel', 'stylesheet');
  styleLinkEl.setAttribute('href', 'style.css');

  const shadowEl = hostEl.attachShadow({ mode: isOpen ? 'open' : 'closed' });
  shadowEl.appendChild(styleLinkEl);
  shadowEl.appendChild(containerEl);

  return shadowEl;
};

const DemoWithShadowDom = function () {
  const [active, setActive] = React.useState(false);
  const openedShadowHostRef = React.useRef(null);
  const openedShadowRef = React.useRef(null);
  const closedShadowHostRef = React.useRef(null);
  const closedShadowRef = React.useRef(null);

  const handleTrapActivate = React.useCallback(function () {
    setActive(true);
  }, []);

  const handleTrapDeactivate = React.useCallback(function () {
    setActive(false);
  }, []);

  React.useEffect(function () {
    if (openedShadowHostRef.current && !openedShadowRef.current) {
      openedShadowRef.current = createShadow(openedShadowHostRef.current, true);
    }

    if (closedShadowHostRef.current && !closedShadowRef.current) {
      closedShadowRef.current = createShadow(
        closedShadowHostRef.current,
        false
      );
    }
  }, []);

  return (
    <div>
      <p>
        <button
          onClick={handleTrapActivate}
          aria-describedby="with-shadow-dom-heading"
        >
          activate trap
        </button>
      </p>
      <FocusTrap
        active={active}
        focusTrapOptions={{
          onDeactivate: handleTrapDeactivate,
          tabbableOptions: {
            getShadowRoot(node) {
              if (node === closedShadowHostRef.current) {
                return closedShadowHostRef.current;
              }
            },
          },
        }}
      >
        <div className={`trap ${active ? 'is-active' : ''}`}>
          <p>
            Here is a focus trap <a href="#">with</a> <a href="#">some</a>{' '}
            <a href="#">focusable</a> parts.
          </p>
          <div id="with-shadow-dom-opened-host" ref={openedShadowHostRef}></div>
          <div id="with-shadow-dom-closed-host" ref={closedShadowHostRef}></div>
          <p>
            <button
              onClick={handleTrapDeactivate}
              aria-describedby="with-shadow-dom-heading"
            >
              deactivate trap
            </button>
          </p>
        </div>
      </FocusTrap>
    </div>
  );
};

ReactDOM.render(
  <DemoWithShadowDom />,
  document.getElementById('demo-with-shadow-dom')
);
