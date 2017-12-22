const chunkToMap = (arr) => {
  let map = new Map();

  while (arr.length > 0) {
    const key = arr.shift();
    const value = arr.shift();
    map.set(key, value);
  }

  return map;
};

const mergeArguments = (argNames, argValues) => {
  const map = new Map();
  for (let i = 0; i < argNames.length; i += 1) {
    map.set(argNames[i], argValues[i]);
  }
  return map;
};

module.exports = { chunkToMap, mergeArguments };
