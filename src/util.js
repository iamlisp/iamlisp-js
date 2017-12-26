const { Map } = require('immutable');
const { chunk } = require('lodash');
const Symbol = require('./Symbol');

const chunkToMap = (arr) => {
  return chunk(arr, 2)
    .reduce((acc, [key, value]) => {
      if (key instanceof Symbol) {
        return acc.set(key.name, value);
      }
      if (typeof key === 'string') {
        return acc.set(key, value);
      }
      throw new TypeError('Key values should be a symbol or string');
    }, Map());
};

const pipe = funcs => value => funcs.reduce((value, func) => func(value), value);

module.exports = { chunkToMap, pipe };
