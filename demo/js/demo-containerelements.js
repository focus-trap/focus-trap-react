const React = require('react');
const ReactDOM = require('react-dom');
const DemoContainerElements = require('./component-examples/demo-containerelements');

const container = document.getElementById('demo-containerelements');

ReactDOM.render(<DemoContainerElements />, container);
