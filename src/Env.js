import { entries } from "lodash";

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

  sett(key, value) {
    if (key in this.map) {
      this.map[key] = value;
      return;
    }

    if (!this.parent) {
      throw new Error(`Symbol "${key}" is not defined`);
    }

    return this.parent.sett(key, value);
  }

  get keys() {
    return Object.keys(this.map);
  }

  import(moduleEnv, moduleName) {
    const symbolPrefix =
      typeof moduleName === "undefined" ? "" : `${moduleName}/`;
    for (const key of moduleEnv.keys) {
      this.set(`${symbolPrefix}${key}`, moduleEnv.get(key));
    }
  }

  merge(otherMap, redef = false) {
    const setFn = redef ? this.sett.bind(this) : this.set.bind(this);
    entries(otherMap).forEach(([key, value]) => setFn(key, value));
  }
}
