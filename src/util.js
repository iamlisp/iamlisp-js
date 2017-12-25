const Symbol = require('./Symbol');

const chunkToMap = (arr) => {
  let map = new Map();

  while (arr.length > 0) {
    const key = arr.shift();
    const value = arr.shift();
    map.set(key, value);
  }

  return map;
};

const pipe = funcs => value => funcs.reduce((value, func) => func(value), value);

module.exports = { chunkToMap, pipe };
