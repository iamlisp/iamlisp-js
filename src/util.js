chunkToMap = (arr) => {
  let map = new Map();

  while (arr.length > 0) {
    const key = arr.shift();
    const value = arr.shift();
    map.set(key, value);
  }

  return map;
};

module.exports = { chunkToMap };
