export default class SpecialForm {
  constructor(action) {
    this.action = action;
  }
  perform(env, args, strict) {
    return this.action(env, args, strict);
  }
}
