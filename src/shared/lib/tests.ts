export const nextTick = (cb: CallableFunction) => {
  setTimeout(() => {
    cb();
  }, 0);
};
