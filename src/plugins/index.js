const { pipe } = require('../util');

module.exports = pipe([
  require('./placeholder'),
  require('./quote'),
]);
