export default class Env {
  constructor(map = {}, parent) {
    this.map = map;
    this.parent = parent;
  }

  set(key, value) {
    this.map[key] = value;
  }

  get(key) {
    if (key in this.map) {
      return this.map[key];
    }

    if (!this.parent) {
      throw new Error(`Symbol "${key}" is not defined`);
    }

    return this.parent.get(key);
  }

  get keys() {
    return Object.keys(this.map);
  }

  import(moduleEnv, moduleName) {
    for (const key of moduleEnv.keys) {
      this.set(`${moduleName}/${key}`, moduleEnv.get(key));
    }
  }
}
