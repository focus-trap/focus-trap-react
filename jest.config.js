module.exports = {
  clearMocks: true,
  setupFilesAfterEnv: [
    'regenerator-runtime/runtime',
    '<rootDir>/jest-setup.js',
  ],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  testPathIgnorePatterns: ['/node_modules/', '/cypress/'],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  coverageDirectory: '<rootDir>/coverage',
};
