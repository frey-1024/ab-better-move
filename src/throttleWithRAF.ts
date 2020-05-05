const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

export default function throttleWithRAF(fn: (...any) => any) {
  let ticking = false;
  let callback;
  const update = function (...arg) {
    fn(...arg);
    ticking = false;
  };
  return function (...arg) {
    if (!ticking) {
      callback = callback ? callback : () => update(...arg);
      requestAnimationFrame(callback);
    }
    ticking = true;
  };
}
