const parse = require('./src/parser');

console.log(parse('hello world'));
console.log(parse('hello\\ world'));
console.log(parse('(hello world)'));
