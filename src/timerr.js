global.timerr = function() {};
timerr.start = function(tag) {
  timerr[tag] = timerr[tag] || { execTime: 0, state: 1 };
  timerr[tag].start = Date.now();
  timerr[tag].state === 1;
};
timerr.pause = function(tag) {
  timerr[tag].state === 1 &&
    (timerr[tag].execTime += Date.now() - timerr[tag].start);
  timerr[tag].state === 2;
};
timerr.stop = function(tag) {
  timerr.pause(tag);
  return timerr[tag].execTime;
};
