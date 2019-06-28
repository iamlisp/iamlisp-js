export default class SpecialForm {
  constructor(action) {
    this.action = action;
  }
  perform(env, args) {
    return this.action(env, args);
  }
}
