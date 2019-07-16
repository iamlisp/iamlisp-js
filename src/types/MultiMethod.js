export default class MultiMethod {
  constructor(dispatchFn) {
    this.dispatchFn = dispatchFn;
    this.methods = new Map();
  }
}
