/**
 * Merge argument names with values.

 * @param {string[]} names 
 * @param {*[]} values 
 */
function mergeArgs(names, values) {
  const args = {};
  for (let i = 0; i < names.length; i += 1) {
    args[names[i]] = values[i];
  }
  return args;
}

module.exports = mergeArgs;
