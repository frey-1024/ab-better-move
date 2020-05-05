import ReactDOM from 'react-dom';

function addDOMEventListener(target, eventType, callback, option) {
  if (target.addEventListener) {
    let useCapture = false;
    if (typeof option === 'object') {
      useCapture = option.capture || false;
    } else if (typeof option === 'boolean') {
      useCapture = option;
    }

    target.addEventListener(eventType, callback, option || false);

    return {
      remove() {
        target.removeEventListener(eventType, callback, useCapture);
      }
    };
  }
}

export interface ListenerEventHandler {
  remove: () => void;
}

export default function addEventListener(
  target: any,
  eventType: string,
  cb: (e: any) => any,
  option?: object | boolean
): ListenerEventHandler {
  // setState 强制批量处理
  const callback = ReactDOM.unstable_batchedUpdates
    ? function run(e: any) {
        ReactDOM.unstable_batchedUpdates(cb, e);
      }
    : cb;
  return addDOMEventListener(target, eventType, callback, option);
}
