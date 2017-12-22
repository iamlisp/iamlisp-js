module.exports = class SpecialForm {
  constructor(action) {
    this.action = action;
  }
  perform(env, evaluate, args) {
    return this.action(env, evaluate, args);
  }
}
