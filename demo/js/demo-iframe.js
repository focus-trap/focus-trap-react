const React = require('react');
const ReactDOM = require('react-dom');
const { createRoot } = require('react-dom/client');
const PropTypes = require('prop-types');
const { FocusTrap } = require('../../dist/focus-trap-react');

const { useRef, useState, useEffect } = React;
const container = document.getElementById('demo-iframe');

const SandboxContext = React.createContext({
  document,
});

SandboxContext.displayName = 'SandboxContext';
const SandboxContextConsumer = SandboxContext.Consumer;
const Sandbox = ({ children }) => {
  const iframeRef = useRef(null);
  const [state, setState] = useState({
    iframeLoaded: false,
  });

  useEffect(() => {
    const iframe = iframeRef.current;

    const loadIframe = () => {
      const { contentWindow } = iframe;
      const cssLink = document.createElement('link');
      cssLink.href = 'style.css';
      cssLink.rel = 'stylesheet';
      cssLink.type = 'text/css';
      if (contentWindow) {
        const { head } = contentWindow.document;
        head.appendChild(cssLink);
        setTimeout(() => setState({ iframeLoaded: true }), 0);
      }
    };

    const isIframeLoaded = iframe.contentWindow !== null;

    if (isIframeLoaded) {
      loadIframe();
    } else {
      iframe.onload = loadIframe;
    }
  }, []);

  return (
    <iframe ref={iframeRef} style={{ padding: 0, border: 0 }}>
      {state.iframeLoaded &&
        ReactDOM.createPortal(
          <SandboxContext.Provider value={iframeRef.current.contentDocument}>
            {children}
          </SandboxContext.Provider>,
          iframeRef.current.contentDocument.body
        )}
    </iframe>
  );
};

Sandbox.propTypes = {
  children: PropTypes.node.isRequired,
};

const DemoIframe = () => {
  const [state, setState] = useState({ activeTrap: false });
  const mountTrap = () => {
    setState({ activeTrap: true });
  };
  const unmountTrap = () => {
    setState({ activeTrap: false });
  };
  const trap = state.activeTrap && (
    <Sandbox>
      <SandboxContextConsumer>
        {(document) => (
          <FocusTrap
            focusTrapOptions={{
              document,
              onDeactivate: unmountTrap,
            }}
          >
            <div className="trap is-active">
              <p>
                Here is a focus trap inside an iframe <a href="#">with</a>{' '}
                <a href="#">some</a> <a href="#">focusable</a> parts.
              </p>
              <p>
                <button onClick={unmountTrap} aria-describedby="iframe-heading">
                  deactivate trap
                </button>
              </p>
            </div>
          </FocusTrap>
        )}
      </SandboxContextConsumer>
    </Sandbox>
  );
  return (
    <div>
      <p>
        <button onClick={mountTrap} aria-describedby="iframe-heading">
          activate trap
        </button>
      </p>
      {trap}
    </div>
  );
};

const root = createRoot(container);
root.render(<DemoIframe />);
