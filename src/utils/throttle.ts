const throttle = <A>(callback: (args?: A) => unknown, timeout: number) => {
    let freeze = false;

    return (args?: A) => {
        let timeoutFunc: ReturnType<typeof setTimeout>;

        if (freeze) {
            return;
        }

        freeze = true;
        callback(args);
    
        timeoutFunc = setTimeout(() => {
            freeze = false;
            clearTimeout(timeoutFunc);
        }, timeout);
    };
};


export { throttle };