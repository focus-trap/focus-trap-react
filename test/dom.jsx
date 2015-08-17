var React = require('react/addons');
var test = require('tape');
var FocusTrap = require('../');

var TestUtils = React.addons.TestUtils;

test('DOM with only required props', function(t) {
  var trap = TestUtils.renderIntoDocument(
    <FocusTrap onDeactivate={noop}>
      <button>
        something special
      </button>
    </FocusTrap>
  );
  var trapNode = React.findDOMNode(trap);

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
  var trapNode = React.findDOMNode(trap);

  t.equal(trapNode.tagName, 'FIGURE')
  t.equal(trapNode.getAttribute('id'), 'foo')
  t.equal(trapNode.getAttribute('class'), 'bar')
  t.equal(trapNode.getAttribute('style'), 'background:pink;')
  t.equal(trapNode.children.length, 1);
  t.equal(trapNode.firstChild.tagName, 'BUTTON');
  t.equal(trapNode.firstChild.innerHTML, 'something special');

  t.end();
});

function noop() {}
