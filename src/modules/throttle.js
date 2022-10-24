export function throttle(callback, delay) {
  let isWayting = false;
  let savedArgs = null;
  let savedThis = null;
  return function wrapper(...args) {
    if (isWayting) {
      savedArgs = args;
      savedThis = this;
      return;
    }
    callback.apply(this, args);
    isWayting = true;
    setTimeout(() => {
      isWayting = false;
      if (savedThis) {
        wrapper.apply(savedThis, savedArgs);
        savedThis = null;
        savedArgs = null;
      }
    }, delay);
  };
}
