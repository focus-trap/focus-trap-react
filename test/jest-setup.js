require('@testing-library/jest-dom/extend-expect');

global.requestAnimationFrame = function (callback) {
  setTimeout(callback, 0);
};
