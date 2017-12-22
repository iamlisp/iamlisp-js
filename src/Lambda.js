module.exports = class Lambda {
  constructor(args, body, env) {
    this.args = args;
    this.body = body;
    this.env = env;
  }
}
