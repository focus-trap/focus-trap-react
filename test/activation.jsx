var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var test = require('tape');
var sinon = require('sinon');
var vanillaFocusTrap = require('focus-trap');
var FocusTrap = require('../');

var activateSpy = sinon.spy(vanillaFocusTrap, 'activate');

test('default activation', function(t) {
  var domContainer = setup();
  var trap = ReactDOM.render(
    <FocusTrap onDeactivate={noop}>
      <button>
        something special
      </button>
    </FocusTrap>,
    domContainer
  );

  t.ok(activateSpy.calledOnce);
  t.deepEqual(activateSpy.getCall(0).args, [
    ReactDOM.findDOMNode(trap),
    {
      onDeactivate: noop,
      initialFocus: undefined,
      escapeDeactivates: true,
      clickOutsideDeactivates: undefined,
    },
  ]);

  teardown();
  t.end();
});

test('activation with initialFocus as selector', function(t) {
  var domContainer = setup();
  var trap = ReactDOM.render(
    <FocusTrap
      onDeactivate={noop}
      initialFocus='#initial-focusee'
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
    ReactDOM.findDOMNode(trap),
    {
      onDeactivate: noop,
      initialFocus: '#initial-focusee',
      escapeDeactivates: true,
      clickOutsideDeactivates: undefined,
    },
  ]);

  teardown();
  t.end();
});

test('mounting without activation', function(t) {
  var domContainer = setup();
  var trap = ReactDOM.render(
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
  var trapNode = ReactDOM.findDOMNode(trap);

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

  var zone = ReactDOM.render(<TestZone />, domContainer);

  t.notOk(activateSpy.called);

  TestUtils.Simulate.click(ReactDOM.findDOMNode(zone.refs.trigger));

  t.ok(activateSpy.calledOnce);
  t.deepEqual(activateSpy.getCall(0).args, [
    ReactDOM.findDOMNode(zone.refs.trap),
    {
      onDeactivate: noop,
      initialFocus: undefined,
      escapeDeactivates: true,
      clickOutsideDeactivates: undefined,
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
  ReactDOM.unmountComponentAtNode(domContainer);
  document.body.removeChild(domContainer);
}
