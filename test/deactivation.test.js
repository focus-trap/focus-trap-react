const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-dom/test-utils');
const FocusTrap = require('../src/focus-trap-react');

// TODO: These issues are related to older React features which we'll likely need
//  to fix in order to move the code forward to the next major version of React.
//  @see https://github.com/davidtheclark/focus-trap-react/issues/77
/* eslint-disable react/no-find-dom-node, react/no-render-return-value, react/no-string-refs */

describe('deactivation', () => {
  let domContainer;
  const mockFocusTrap = {
    activate: jest.fn(),
    deactivate: jest.fn(),
    pause: jest.fn(),
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

  test('deactivation', () => {
    class TestZone extends React.Component {
      state = {
        trapActive: true,
      };

      deactivateTrap = () => {
        this.setState({ trapActive: false });
      };

      render() {
        return (
          <div>
            <button ref="trigger" onClick={this.deactivateTrap}>
              deactivate
            </button>
            <FocusTrap
              ref="trap"
              _createFocusTrap={mockCreateFocusTrap}
              active={this.state.trapActive}
            >
              <div>
                <button>something special</button>
              </div>
            </FocusTrap>
          </div>
        );
      }
    }

    const zone = ReactDOM.render(<TestZone />, domContainer);

    expect(mockFocusTrap.deactivate).toHaveBeenCalledTimes(0);

    TestUtils.Simulate.click(ReactDOM.findDOMNode(zone.refs.trigger));

    expect(mockFocusTrap.deactivate).toHaveBeenCalledTimes(1);
  });

  describe('deactivation respects `returnFocusOnDeactivate` option', () => {
    class TestZone extends React.Component {
      state = {
        trapActive: true,
      };

      deactivateTrap = () => {
        this.setState({ trapActive: false });
      };

      render() {
        return (
          <div>
            <button ref="trigger" onClick={this.deactivateTrap}>
              deactivate
            </button>
            <FocusTrap
              ref={(component) => (this.trap = component)}
              _createFocusTrap={mockCreateFocusTrap}
              active={this.state.trapActive}
              // eslint-disable-next-line react/prop-types
              focusTrapOptions={this.props.trapOptions}
            >
              <div>
                <button>something special</button>
              </div>
            </FocusTrap>
          </div>
        );
      }
    }

    test('returnFocusOnDeactivate = true', () => {
      const zone = ReactDOM.render(
        <TestZone trapOptions={{ returnFocusOnDeactivate: true }} />,
        domContainer
      );

      // mock deactivate on the focusTrap instance so we can assert
      // that we are passing the correct config to the focus trap.
      zone.trap.focusTrap.deactivate = jest.fn();

      // mock the FocusTrap instance's returnFocus() method so we can make sure
      //  it gets called
      zone.trap.returnFocus = jest.fn();

      TestUtils.Simulate.click(ReactDOM.findDOMNode(zone.refs.trigger));

      // we should always be calling deactivate() with returnFocus=false since
      //  we take care of returning focus ourselves
      expect(zone.trap.focusTrap.deactivate).toHaveBeenCalledWith({
        returnFocus: false,
      });

      // since we set returnFocusOnDeactivate=true, FocusTrap should've tried to return focus
      expect(zone.trap.returnFocus).toHaveBeenCalled();
    });

    test('returnFocusOnDeactivate = false', () => {
      const zone = ReactDOM.render(
        <TestZone trapOptions={{ returnFocusOnDeactivate: false }} />,
        domContainer
      );

      // mock deactivate on the focusTrap instance so we can assert
      // that we are passing the correct config to the focus trap.
      zone.trap.focusTrap.deactivate = jest.fn();

      // mock the FocusTrap instance's returnFocus() method so we can make sure
      //  it gets called
      zone.trap.returnFocus = jest.fn();

      TestUtils.Simulate.click(ReactDOM.findDOMNode(zone.refs.trigger));

      // we should always be calling deactivate() with returnFocus=false since
      //  we take care of returning focus ourselves
      expect(zone.trap.focusTrap.deactivate).toHaveBeenCalledWith({
        returnFocus: false,
      });

      // since we set returnFocusOnDeactivate=false, FocusTrap should NOT have tried to return focus
      expect(zone.trap.returnFocus).not.toHaveBeenCalled();
    });

    test('returnFocusOnDeactivate defaults to true', () => {
      const zone = ReactDOM.render(<TestZone />, domContainer);

      // mock deactivate on the focusTrap instance so we can assert
      // that we are passing the correct config to the focus trap.
      zone.trap.focusTrap.deactivate = jest.fn();

      // mock the FocusTrap instance's returnFocus() method so we can make sure
      //  it gets called
      zone.trap.returnFocus = jest.fn();

      TestUtils.Simulate.click(ReactDOM.findDOMNode(zone.refs.trigger));

      // we should always be calling deactivate() with returnFocus=false since
      //  we take care of returning focus ourselves
      expect(zone.trap.focusTrap.deactivate).toHaveBeenCalledWith({
        returnFocus: false,
      });

      // since default is returnFocusOnDeactivate=true, FocusTrap should've tried to return focus
      expect(zone.trap.returnFocus).toHaveBeenCalled();
    });
  });

  test('deactivation by dismount', () => {
    class TestZone extends React.Component {
      state = {
        trapActive: true,
      };

      deactivateTrap = () => {
        this.setState({ trapActive: false });
      };

      render() {
        const trap = this.state.trapActive ? (
          <FocusTrap _createFocusTrap={mockCreateFocusTrap} ref="trap">
            <button>something special</button>
          </FocusTrap>
        ) : (
          false
        );

        return (
          <div>
            <button ref="trigger" onClick={this.deactivateTrap}>
              deactivate
            </button>
            {trap}
          </div>
        );
      }
    }

    const zone = ReactDOM.render(<TestZone />, domContainer);

    expect(mockFocusTrap.deactivate).toHaveBeenCalledTimes(0);

    TestUtils.Simulate.click(ReactDOM.findDOMNode(zone.refs.trigger));

    expect(mockFocusTrap.deactivate).toHaveBeenCalledTimes(1);
  });
});
