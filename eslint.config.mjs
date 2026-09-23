//
// ROOT ESLint Configuration
//

import url from 'node:url';
import path from 'node:path';
import js from '@eslint/js';
import globals from 'globals';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import importPlugin, {
  flatConfigs as importFlatConfigs,
} from 'eslint-plugin-import-x';
import jest from 'eslint-plugin-jest';
import jestDom from 'eslint-plugin-jest-dom';
import cypress from 'eslint-plugin-cypress';
import reactX from '@eslint-react/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import testingLibrary from 'eslint-plugin-testing-library';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const ecmaVersion = 'latest';
const impliedStrict = true;
const tsconfigRootDir = __dirname;

//
// Plugins
//

// Plugins that apply to ALL envs
const basePlugins = {};

const importPluginSettings = {
  'import-x/resolver': {
    node: {
      extensions: [
        '.js',
        '.jsx',
        '.cts',
        '.mjs',
        '.ts',
        '.tsx',
        '.cts',
        '.mts',
      ],
      moduleDirectory: ['node_modules', 'src/'],
    },
    typescript: {
      alwaysTryTypes: true,
    },
  },
};

//
// Globals
//

// Globals that apply to ALL envs
const baseGlobals = {
  // anything in addition to what `languageOptions.ecmaVersion` provides
  // @see https://eslint.org/docs/latest/use/configure/language-options#predefined-global-variables
};

// Globals for repo tooling scripts
const toolingGlobals = {
  ...globals.node,
};

// Globals for browser-based source code
const browserGlobals = {
  ...globals.browser,
};

// Globals for test files
const testGlobals = {
  ...globals.jest,
  ...cypress.configs.globals.languageOptions.globals,

  // `globals.browser` defines this global but it's also part of the `testing-library`
  //  API so needs to be overwritable to avoid ESLint's `no-redeclare` rule
  screen: 'off',
};

// Globals for BUNDLED (Webpack, Rollup, etc) source code
// NOTE: these must also be defined in <repo>/src/globals.d.ts referenced in the
//  <repo>/tsconfig.json as well as the `globals` property in <repo>/jest.config.mjs
const bundlerGlobals = {};

//
// Base rules
// @see http://eslint.org/docs/rules/RULE-NAME
//

const baseRules = {
  ...js.configs.recommended.rules,
  'no-regex-spaces': 'off',
  'no-await-in-loop': 'error',
  'no-async-promise-executor': 'error',
  'no-misleading-character-class': 'error',
  'no-unsafe-optional-chaining': 'error',

  //// Best practices

  curly: 'error',
  'default-case': 'error',
  eqeqeq: 'error',
  'guard-for-in': 'error',
  'no-alert': 'error',
  'no-caller': 'error',
  'no-console': 'error',
  'no-else-return': 'error',
  'no-eq-null': 'error',
  'no-eval': 'error',
  'no-lone-blocks': 'error',
  'no-loop-func': 'error',
  'no-multi-spaces': 'error',
  'no-new': 'off',
  'no-new-func': 'error',
  'no-new-wrappers': 'error',
  'no-throw-literal': 'error',
  'no-warning-comments': [
    'error',
    {
      terms: ['DEBUG', 'FIXME', 'HACK'],
      location: 'start',
    },
  ],

  //// Strict mode

  strict: ['error', 'function'],

  //// Variables

  'no-catch-shadow': 'error',
  'no-shadow': 'error',
  'no-unused-vars': [
    'error',
    {
      args: 'none',
      caughtErrors: 'none',
      vars: 'local',
    },
  ],
  'no-use-before-define': 'error',

  //// Stylistic issues

  // NONE: Prettier will take care of these by reformatting the code on commit,
  //  save a few exceptions.

  // Prettier will format using single quotes per .prettierrc.js settings, but
  //  will not require single quotes instead of backticks/template strings
  //  when interpolation isn't used, so this rule will catch those cases
  quotes: [
    'error',
    'single',
    {
      avoidEscape: true,
      allowTemplateLiterals: false,
    },
  ],

  //// ECMAScript 6 (non-stylistic issues only)

  'no-duplicate-imports': ['error', { includeExports: true }],
  'no-useless-constructor': 'error',
  'no-var': 'error',
  'prefer-const': 'error',
};

//
// React-specific rules
// Assumes the @eslint-react/eslint-plugin and react-hooks plugins are installed
//

const reactRules = {
  ...reactX.configs.recommended.rules,

  // already covered by the react-hooks plugin below; avoid duplicate reporting
  '@eslint-react/rules-of-hooks': 'off',

  //// React-Hooks Plugin

  // default is 'warn', prefer errors (warnings just get ignored)
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'error',
};

// @see https://www.npmjs.com/package/@eslint-react/eslint-plugin (settings.react-x)
const reactSettings = {
  ...reactX.configs.recommended.settings,
};

//
// TypeScript-specific rules
// Assumes the @typescript-eslint/eslint-plugin is installed
//

const typescriptRules = {
  ...typescript.configs['recommended-type-checked'].rules,

  // AFTER TypeScript rules to turn off `import` rules that TypeScript covers
  ...importFlatConfigs.typescript.rules,
};

//
// Test-specific rules
//

const testRules = {
  //// jest plugin

  'jest/no-disabled-tests': 'error',
  'jest/no-focused-tests': 'error',
  'jest/no-identical-title': 'error',
  'jest/valid-title': 'error',

  // doesn't work well when expect() used with Cypress API
  'jest/valid-expect': 'off',

  //// jest-dom plugin

  // this rule is buggy, and doesn't seem to work well with the Testing Library's queries
  'jest-dom/prefer-in-document': 'off',

  //// testing-library plugin

  // this prevents expect(document.querySelector('foo')), which is useful because not
  //  all elements can be found using RTL queries (sticking to RTL queries probably
  //  means less fragile tests, but then there are things we wouldn't be able to
  //  test like whether something renders in Light mode or Dark mode as expected)
  'testing-library/no-node-access': 'off',

  // we use custom queries, which don't get added to `screen` (that's a miss in RTL, IMO),
  //  which means we _must_ destructure the result from `render()` in order to get to
  //  our custom queries
  'testing-library/prefer-screen-queries': 'off',

  // not much value in this one, and it's not sophisticated enough to detect all usage
  //  scenarios so we get false-positives
  'testing-library/await-async-utils': 'off',

  //// Cypress plugin

  ...cypress.configs.recommended.rules,
};

//
// Config generators
//

/**
 * Project scripts.
 * @param {boolean} isModule
 * @param {boolean} isTypescript Ignored if `isModule=false`
 * @returns {Object} ESLint config.
 */
const createToolingConfig = (isModule = true, isTypescript = false) => ({
  files: isModule
    ? isTypescript
      ? ['**/*.{ts,mts}']
      : ['**/*.{js,mjs}']
    : ['**/*.{js,cjs}'],
  ignores: ['src/**/*.*', 'demo/**/*.*'],
  plugins: {
    ...basePlugins,
    ...(isModule ? { 'import-x': importPlugin } : {}),
    ...(isTypescript ? { '@typescript-eslint': typescript } : {}),
  },
  languageOptions: {
    ecmaVersion,
    parser: isTypescript ? typescriptParser : undefined,
    parserOptions: {
      sourceType: isModule ? 'module' : 'script',
      ...(isModule && isTypescript
        ? {
            project: true,
            tsconfigRootDir,
          }
        : {}),
      ecmaFeatures: {
        impliedStrict,
        jsx: false,
      },
    },
    globals: {
      ...baseGlobals,
      ...toolingGlobals,
    },
  },
  settings: {
    ...(isModule ? importPluginSettings : {}),
  },
  rules: {
    ...baseRules,
    ...(isModule ? importFlatConfigs.recommended.rules : {}), // BEFORE TypeScript rules
    ...(isModule && isTypescript ? typescriptRules : {}),
    'no-console': 'off', // OK in repo scripts
  },
});

/**
 * JavaScript source files.
 * @param {boolean} isReact If source will include JSX code.
 * @returns ESLint config.
 */
const createSourceJSConfig = (isReact = false) => ({
  files: isReact ? ['src/**/*.{js,jsx}'] : ['src/**/*.js'],
  plugins: {
    ...basePlugins,
    'import-x': importPlugin,
    ...(isReact ? { '@eslint-react': reactX, 'react-hooks': reactHooks } : {}),
  },
  languageOptions: {
    ecmaVersion,
    parserOptions: {
      sourceType: 'script',
      ecmaFeatures: {
        impliedStrict,
        jsx: isReact,
      },
    },
    globals: {
      ...baseGlobals,
      ...bundlerGlobals,
      ...browserGlobals,
      ...globals.commonjs,
    },
  },
  settings: {
    ...importPluginSettings,
    ...(isReact ? reactSettings : {}),
  },
  rules: {
    ...baseRules,
    ...importFlatConfigs.recommended.rules,
    ...(isReact ? reactRules : {}),
  },
});

/**
 * JavaScript doc/example files.
 * @returns ESLint config.
 */
const createDemoJSConfig = () => {
  const config = createSourceJSConfig(true);
  config.files = ['demo/**/*.js'];
  // unlike src (CJS), the demo is bundled with Rollup and uses ESM `import`
  config.languageOptions.parserOptions.sourceType = 'module';
  config.languageOptions.globals = {
    ...baseGlobals,
    ...bundlerGlobals,
    ...browserGlobals,
  };
  return config;
};

const createSourceTSConfig = (isReact = false) => ({
  files: isReact
    ? ['src/**/*.tsx', 'demo/**/*.tsx']
    : ['src/**/*.ts', 'demo/**/*.ts'],
  plugins: {
    ...basePlugins,
    'import-x': importPlugin,
    '@typescript-eslint': typescript,
    ...(isReact ? { '@eslint-react': reactX, 'react-hooks': reactHooks } : {}),
  },
  languageOptions: {
    ecmaVersion,
    parser: typescriptParser,
    parserOptions: {
      project: true,
      tsconfigRootDir,
      sourceType: 'module',
      ecmaFeatures: {
        impliedStrict,
        jsx: isReact,
      },
    },
    globals: {
      ...baseGlobals,
      ...bundlerGlobals,
      ...browserGlobals,
    },
  },
  settings: {
    ...importPluginSettings,
    ...(isReact ? reactSettings : {}),
  },
  rules: {
    ...baseRules,
    ...importFlatConfigs.recommended.rules, // BEFORE TypeScript rules
    ...typescriptRules,
    ...(isReact ? reactRules : {}),
  },
});

const createTestConfig = (isTypescript = false) => ({
  files: isTypescript
    ? ['test/**/*.ts', 'cypress/e2e/**/*.ts']
    : ['test/**/*.js', 'cypress/e2e/**/*.js'],
  plugins: {
    ...basePlugins,
    'import-x': importPlugin,
    ...(isTypescript ? { '@typescript-eslint': typescript } : {}),
    jest,
    'jest-dom': jestDom,
    'testing-library': testingLibrary,
    '@eslint-react': reactX,
    'react-hooks': reactHooks,
    cypress,
  },
  languageOptions: {
    ecmaVersion,
    parser: isTypescript ? typescriptParser : undefined,
    parserOptions: {
      ...(isTypescript
        ? {
            project: true,
            tsconfigRootDir,
          }
        : {}),
      sourceType: isTypescript ? 'module' : 'script',
      ecmaFeatures: {
        impliedStrict,
        jsx: true,
      },
    },
    globals: {
      ...baseGlobals,
      ...bundlerGlobals, // because tests execute code that also gets bundled
      ...browserGlobals,
      ...testGlobals,
      ...(isTypescript ? {} : globals.commonjs),
    },
  },
  settings: {
    ...importPluginSettings,
    ...reactSettings,
  },
  rules: {
    ...baseRules,
    ...importFlatConfigs.recommended.rules, // BEFORE TypeScript rules
    ...(isTypescript ? typescriptRules : {}),
    ...reactRules,
    ...testRules,
  },
});

export default [
  // Ignores
  {
    ignores: [
      // third-party
      '**/node_modules/',
      // build output
      'dist/**',
      '**/*-bundle.js',
      // test output
      'coverage/**',
    ],
  },

  // Tooling Configs
  createToolingConfig(false), // CJS scripts
  createToolingConfig(true), // ESM scripts
  createToolingConfig(true, true), // TS scripts

  // Source Configs
  createSourceJSConfig(), // Plain JS source
  createSourceJSConfig(true), // React JS source
  createSourceTSConfig(), // Plain TS source
  createSourceTSConfig(true), // React TS source

  // Docs Config
  createDemoJSConfig(),

  // Test Configs
  createTestConfig(), // JS tests
  createTestConfig(true), // TS tests

  // Prettier
  // ALWAYS LAST: disable style rules that conflict with prettier
  // @see https://typescript-eslint.io/troubleshooting/formatting#suggested-usage---prettier
  {
    plugins: {
      prettier,
    },
    rules: prettier.rules,
  },
];
