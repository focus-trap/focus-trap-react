require('@testing-library/jest-dom');

global.requestAnimationFrame = function (callback) {
  setTimeout(callback, 0);
};
