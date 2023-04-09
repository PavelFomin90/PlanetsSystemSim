const throttle = <A>(callback: (args?: A) => unknown, timeout: number) => {
  let freeze = false;

  return (args?: A) => {
    if (freeze) {
      return;
    }

    freeze = true;
    callback(args);

    const timeoutFunc = setTimeout(() => {
      freeze = false;
      clearTimeout(timeoutFunc);
    }, timeout);
  };
};

export { throttle };
