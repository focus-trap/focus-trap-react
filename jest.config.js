module.exports = {
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest'
  },
  setupFilesAfterEnv: ['<rootDir>/test/jest-setup.js'],
  clearMocks: true,
  testURL: 'http://localhost'
};
