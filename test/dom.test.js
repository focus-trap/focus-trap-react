const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-dom/test-utils');
const FocusTrap = require('../dist/focus-trap-react');

describe('dom', () => {
  let domContainer;
  const mockFocusTrap = {
    activate: jest.fn(),
    deactivate: jest.fn(),
    pause: jest.fn()
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

  test('DOM with only required props', () => {
    const trap = TestUtils.renderIntoDocument(
      <FocusTrap _createFocusTrap={mockCreateFocusTrap}>
        <button>
          something special
        </button>
      </FocusTrap>
    );
    const trapNode = ReactDOM.findDOMNode(trap);

    expect(trapNode.tagName).toBe('DIV');
    expect(trapNode.getAttribute('id')).toBe(null);
    expect(trapNode.getAttribute('class')).toBe(null);
    expect(trapNode.getAttribute('style')).toBe(null);
    expect(trapNode.children.length).toBe(1);
    expect(trapNode.firstChild.tagName).toBe('BUTTON');
    expect(trapNode.firstChild.innerHTML).toBe('something special');
  });

  test('DOM with all possible DOM-related props', () => {
    const trap = TestUtils.renderIntoDocument(
      <FocusTrap
        _createFocusTrap={mockCreateFocusTrap}
        id="foo"
        className="bar"
        tag="figure"
      >
        <button>
          something special
        </button>
      </FocusTrap>
    );
    const trapNode = ReactDOM.findDOMNode(trap);

    expect(trapNode.tagName).toBe('FIGURE');
    expect(trapNode.getAttribute('id')).toBe('foo');
    expect(trapNode.getAttribute('class')).toBe('bar');
    expect(trapNode.children.length).toBe(1);
    expect(trapNode.firstChild.tagName).toBe('BUTTON');
    expect(trapNode.firstChild.innerHTML).toBe('something special');
  });
});
