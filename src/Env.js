import { entries, uniq } from "lodash";
import Lambda from "./types/Lambda";
import { fromArray } from "./types/List";

const ENV_KEYS_MAGIC_KEY = "envkeys";

export default class Env {
  constructor(map = {}, parent) {
    this.map = map;
    this.parent = parent;
  }

  set(key, value) {
    if (value instanceof Lambda && this.map[key] instanceof Lambda) {
      this.map[key].overloads.push(value);
      return;
    }

    this.map[key] = value;
  }

  get(key) {
    if (key in this.map) {
      return this.map[key];
    }

    if (key === ENV_KEYS_MAGIC_KEY) {
      return fromArray(this.deepKeys);
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

  get deepKeys() {
    if (!this.parent) {
      return this.keys;
    }
    return uniq([...this.keys, this.parent.deepKeys]);
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

  // toString() {
  //   return `Env(${this.keys.join(", ")})`;
  // }
}
