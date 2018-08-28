/* eslint-env browser */
const transitions = {
  transition: 'transitionend',
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'oTransitionEnd otransitionend',
};

let transitionEvent;
if (typeof document !== 'undefined') {
  const { style } = document.createElement('div');
  const keys = Object.keys(transitions);
  for (let i = 0, key = keys[i]; i < keys.length; i += 1, key = keys[i]) {
    if (key in style) {
      transitionEvent = transitions[key];
      break;
    }
  }
}

export default (element, callback) => {
  element.addEventListener(transitionEvent, callback);
  return () => element.removeEventListener(transitionEvent, callback);
};
