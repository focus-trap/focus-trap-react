var React = require('react/addons');
var test = require('tape');
var sinon = require('sinon');
var vanillaFocusTrap = require('focus-trap');
var FocusTrap = require('../');

var TestUtils = React.addons.TestUtils;
var activateSpy = sinon.spy(vanillaFocusTrap, 'activate');

test('default activation', function(t) {
  var domContainer = setup();
  var trap = React.render(
    <FocusTrap onDeactivate={noop}>
      <button>
        something special
      </button>
    </FocusTrap>,
    domContainer
  );

  t.ok(activateSpy.calledOnce);
  t.deepEqual(activateSpy.getCall(0).args, [
    React.findDOMNode(trap),
    {
      onDeactivate: noop,
      initialFocus: undefined,
    },
  ]);

  teardown();
  t.end();
});

test('activation with initialFocus as string id', function(t) {
  var domContainer = setup();
  var trap = React.render(
    <FocusTrap
      onDeactivate={noop}
      initialFocus='initial-focusee'
    >
      <button>
        something special
      </button>
      <button id='initial-focusee'>
        another thing
      </button>
    </FocusTrap>,
    domContainer
  );

  t.ok(activateSpy.calledOnce);
  t.deepEqual(activateSpy.getCall(0).args, [
    React.findDOMNode(trap),
    {
      onDeactivate: noop,
      initialFocus: 'initial-focusee',
    },
  ]);

  teardown();
  t.end();
});

test('mounting without activation', function(t) {
  var domContainer = setup();
  var trap = React.render(
    <FocusTrap
      onDeactivate={noop}
      active={false}
    >
      <button>
        something special
      </button>
    </FocusTrap>,
    domContainer
  );
  var trapNode = React.findDOMNode(trap);

  t.notOk(activateSpy.called);

  teardown();
  t.end();
});

test('mounting without activation then activating', function(t) {
  var domContainer = setup();

  var TestZone = React.createClass({
    getInitialState: function() {
      return {
        trapActive: false,
      };
    },

    activateTrap: function() {
      this.setState({ trapActive: true });
    },

    render: function() {
      return (
        <div>
          <button
            ref='trigger'
            onClick={this.activateTrap}
          >
            activate
          </button>
          <FocusTrap
            ref='trap'
            onDeactivate={noop}
            active={this.state.trapActive}
          >
            <button>
              something special
            </button>
          </FocusTrap>
        </div>
      )
    },
  })

  var zone = React.render(<TestZone />, domContainer);

  t.notOk(activateSpy.called);

  TestUtils.Simulate.click(React.findDOMNode(zone.refs.trigger));

  t.ok(activateSpy.calledOnce);
  t.deepEqual(activateSpy.getCall(0).args, [
    React.findDOMNode(zone.refs.trap),
    {
      onDeactivate: noop,
      initialFocus: undefined,
    },
  ]);

  teardown();
  t.end();
});

function noop() {}

var domContainer;

function setup() {
  activateSpy.reset();
  domContainer = document.createElement('div');
  document.body.appendChild(domContainer);
  return domContainer;
}

function teardown() {
  React.unmountComponentAtNode(domContainer);
  document.body.removeChild(domContainer);
}
