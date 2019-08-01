import DotPunctuator from "./DotPunctuator";

export default class Lambda {
  constructor(args, body, env, overloads = []) {
    this.args = args;
    this.body = body;
    this.env = env;
    this.overloads = overloads;
  }

  get isMultiarg() {
    return this.args.some(arg => arg instanceof DotPunctuator);
  }
}
