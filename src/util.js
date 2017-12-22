chunkToObject = ([key, value, ...rest]) => {
  if (key === undefined) {
    return {};
  }

  return { [key]: value, ...chunkToObject(rest) };
};

module.exports = { chunkToObject };
