import { createRequire } from 'node:module';
import babelPlugin from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const isDevServer = process.env.SERVE === 'true';
const isLiveReload = process.env.RELOAD === 'true';

const demoBanner = `/*!
* ${pkg.name} demo bundle
*/`;

export default {
  input: './demo/js/index.js',
  output: {
    name: 'focusTrapReactDemoBundle',
    preserveModules: false,
    file: 'demo/demo-bundle.js',
    format: 'iife',
    sourcemap: true,
    banner: demoBanner,
  },
  plugins: [
    // ALWAYS FIRST: the demo never got a real "production" React build under the old
    //  browserify+babelify setup either (no envify transform was ever wired in, so
    //  `process.env.NODE_ENV` always evaluated to undefined at runtime and React fell
    //  through to its development build) -- replicate that same effective behavior here,
    //  and do it via static replacement rather than a runtime global, since nothing
    //  polyfills a bare `process` global in a Rollup bundle the way browserify does
    replace({
      values: {
        'process.env.NODE_ENV': JSON.stringify('development'),
      },
      preventAssignment: true,
    }),
    resolve(),
    // babel must run BEFORE commonjs: commonjs's CJS-shape analysis parses each
    //  module with acorn (no JSX support), so JSX has to be stripped first --
    //  `exclude` keeps babel off of node_modules (nothing there needs transforming,
    //  and running it there interferes with commonjs's own require-call analysis)
    babelPlugin({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
    }),
    commonjs({
      strictRequires: 'auto',
    }),
    isDevServer &&
      serve({
        port: 9966,
        contentBase: 'demo',
        openPage: '/index.html',
      }),
    isLiveReload && livereload({ watch: 'demo' }),
  ],
};
