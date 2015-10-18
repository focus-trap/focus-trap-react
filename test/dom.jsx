var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var test = require('tape');
var FocusTrap = require('../');

test('DOM with only required props', function(t) {
  var trap = TestUtils.renderIntoDocument(
    <FocusTrap onDeactivate={noop}>
      <button>
        something special
      </button>
    </FocusTrap>
  );
  var trapNode = ReactDOM.findDOMNode(trap);

  t.equal(trapNode.tagName, 'DIV')
  t.equal(trapNode.getAttribute('id'), null)
  t.equal(trapNode.getAttribute('class'), null)
  t.equal(trapNode.getAttribute('style'), null)
  t.equal(trapNode.children.length, 1);
  t.equal(trapNode.firstChild.tagName, 'BUTTON');
  t.equal(trapNode.firstChild.innerHTML, 'something special');

  t.end();
});

test('DOM with all possible DOM-related props', function(t) {
  var trap = TestUtils.renderIntoDocument(
    <FocusTrap
      onDeactivate={noop}
      id='foo'
      className='bar'
      style={{ background: 'pink' }}
      tag='figure'
    >
      <button>
        something special
      </button>
    </FocusTrap>
  );
  var trapNode = ReactDOM.findDOMNode(trap);

  t.equal(trapNode.tagName, 'FIGURE')
  t.equal(trapNode.getAttribute('id'), 'foo')
  t.equal(trapNode.getAttribute('class'), 'bar')
  t.equal(trapNode.getAttribute('style').replace(' ', ''), 'background:pink;')
  t.equal(trapNode.children.length, 1);
  t.equal(trapNode.firstChild.tagName, 'BUTTON');
  t.equal(trapNode.firstChild.innerHTML, 'something special');

  t.end();
});

function noop() {}
