module.exports = {
  presets: [
    // NOTE: With no targets specified, @babel/preset-env will transform all
    //  ECMAScript 2015+ code by default, which is the original preset prior
    //  to upgrading to Babel 7
    // @see https://babeljs.io/docs/en/babel-preset-env#targets
    '@babel/preset-env',
    // 'automatic' compiles JSX via the `react/jsx-runtime` import rather than
    //  requiring `React` to be in scope; only the demo (not the published src/dist)
    //  actually contains JSX, so this only affects the demo bundle
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
};
