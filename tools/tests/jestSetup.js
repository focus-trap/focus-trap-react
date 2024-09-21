import '@testing-library/jest-dom';

global.requestAnimationFrame = function (callback) {
  setTimeout(callback, 0);
};
// DEBUG TEST ESLINT
