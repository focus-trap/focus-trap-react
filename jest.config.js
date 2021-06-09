module.exports = {
  clearMocks: true,
  setupFilesAfterEnv: [
    'regenerator-runtime/runtime',
    '<rootDir>/test/jest-setup.js',
  ],
  testEnvironment: 'jsdom',
  testURL: 'http://localhost',
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
