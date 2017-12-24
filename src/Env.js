module.exports = class Env {
  constructor(map = new Map(), parent) {
    this.map = map;
    this.parent = parent;
  }

  set(key, value) {
    this.map.set(key, value);
  }

  get(key) {
    if (this.map.has(key)) {
      return this.map.get(key);
    }

    if (!this.parent) {
      throw new Error(`Symbol "${key}" is not defined`);
    }

    return this.parent.get(key);
  }

  get entries() {
    return this.map.entries();
  }

  import(moduleEnv, moduleName) {
    for (const [name, value] of moduleEnv.entries) {
      this.set(`${moduleName}/${name}`, value);
    }
  }
}
