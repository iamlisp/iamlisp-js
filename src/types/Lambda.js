export default class Lambda {
  constructor(args, body, env, overloads = []) {
    this.args = args;
    this.body = body;
    this.env = env;
    this.overloads = overloads;
  }
}
