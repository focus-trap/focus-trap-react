const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-dom/test-utils');
const FocusTrap = require('../src/focus-trap-react');

// TODO: These issues are related to older React features which we'll likely need
//  to fix in order to move the code forward to the next major version of React.
//  @see https://github.com/davidtheclark/focus-trap-react/issues/77
/* eslint-disable react/no-find-dom-node, react/no-render-return-value, react/no-string-refs */

const noop = function () {};

describe('activation', () => {
  let domContainer;
  const mockFocusTrap = {
    activate: jest.fn(),
    deactivate: jest.fn(),
    pause: jest.fn(),
    updateContainerElements: jest.fn(),
  };
  let mockCreateFocusTrap;

  beforeEach(() => {
    mockCreateFocusTrap = jest.fn(() => mockFocusTrap);
    domContainer = document.createElement('div');
    document.body.appendChild(domContainer);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(domContainer);
    document.body.removeChild(domContainer);
  });

  test('default activation', () => {
    const trap = ReactDOM.render(
      <FocusTrap
        _createFocusTrap={mockCreateFocusTrap}
        focusTrapOptions={{ onDeactivate: noop }}
      >
        <button>something special</button>
      </FocusTrap>,
      domContainer
    );

    expect(mockCreateFocusTrap).toHaveBeenCalledTimes(1);
    expect(mockCreateFocusTrap).toHaveBeenCalledWith(
      [ReactDOM.findDOMNode(trap)],
      {
        onDeactivate: noop,
        returnFocusOnDeactivate: false,
      }
    );
  });

  test('activation with containerElements props in new props', () => {
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');

    ReactDOM.render(
      <FocusTrap
        _createFocusTrap={mockCreateFocusTrap}
        containerElements={[]}
        focusTrapOptions={{ onDeactivate: noop }}
      >
        <button>something special</button>
      </FocusTrap>,
      domContainer
    );

    expect(mockCreateFocusTrap).not.toHaveBeenCalled();

    ReactDOM.render(
      <FocusTrap
        _createFocusTrap={mockCreateFocusTrap}
        containerElements={[div1, div2]}
        focusTrapOptions={{ onDeactivate: noop }}
      >
        <button>something special</button>
      </FocusTrap>,
      domContainer
    );

    expect(mockCreateFocusTrap).toHaveBeenCalledTimes(1);

    // because we gave the trap 2 valid elements on first render, the trap is
    //  created immediately with the two elements and there's no subsequent
    //  update of the trap's container elements that's necessary
    // NOTE: we test the case of subsequent updates to containerElements in the
    //  e2e tests
    expect(mockFocusTrap.updateContainerElements).not.toHaveBeenCalled();
  });

  test('activation with initialFocus as selector', () => {
    const trap = ReactDOM.render(
      <FocusTrap
        _createFocusTrap={mockCreateFocusTrap}
        focusTrapOptions={{
          onDeactivate: noop,
          initialFocus: '#initial-focusee',
        }}
      >
        <div>
          <button>something special</button>
          <button id="initial-focusee">another thing</button>
        </div>
      </FocusTrap>,
      domContainer
    );

    expect(mockCreateFocusTrap).toHaveBeenCalledTimes(1);
    expect(mockCreateFocusTrap).toHaveBeenCalledWith(
      [ReactDOM.findDOMNode(trap)],
      {
        onDeactivate: noop,
        initialFocus: '#initial-focusee',
        returnFocusOnDeactivate: false,
      }
    );
  });

  test('mounting without activation', () => {
    ReactDOM.render(
      <FocusTrap
        _createFocusTrap={mockCreateFocusTrap}
        focusTrapOptions={{ onDeactivate: noop }}
        active={false}
      >
        <button>something special</button>
      </FocusTrap>,
      domContainer
    );
    expect(mockCreateFocusTrap).toHaveBeenCalledTimes(1);
    expect(mockFocusTrap.activate).toHaveBeenCalledTimes(0);
  });

  test('mounting without activation then activating', () => {
    class TestZone extends React.Component {
      state = {
        trapActive: false,
      };

      activateTrap = () => {
        this.setState({ trapActive: true });
      };

      render() {
        return (
          <div>
            <button ref="trigger" onClick={this.activateTrap}>
              activate
            </button>
            <FocusTrap
              _createFocusTrap={mockCreateFocusTrap}
              ref="trap"
              focusTrapOptions={{ onDeactivate: noop }}
              active={this.state.trapActive}
            >
              <button>something special</button>
            </FocusTrap>
          </div>
        );
      }
    }

    const zone = ReactDOM.render(<TestZone />, domContainer);

    expect(mockCreateFocusTrap).toHaveBeenCalledTimes(1);
    expect(mockCreateFocusTrap).toHaveBeenCalledWith(
      [ReactDOM.findDOMNode(zone.refs.trap)],
      {
        onDeactivate: noop,
        returnFocusOnDeactivate: false,
      }
    );
    expect(mockFocusTrap.activate).toHaveBeenCalledTimes(0);

    TestUtils.Simulate.click(ReactDOM.findDOMNode(zone.refs.trigger));

    expect(mockFocusTrap.activate).toHaveBeenCalledTimes(1);
  });
});
