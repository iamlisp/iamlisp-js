import { AsyncLocalStorage } from "async_hooks";

const storage = new AsyncLocalStorage();

const evaluatorContext = {
  get(key) {
    return storage.getStore()?.get(key);
  },

  set(key, value) {
    const context = storage.getStore();
    if (!context) {
      throw new Error("Evaluator context is not active");
    }
    context.set(key, value);
    return value;
  },

  runAndReturn(fn) {
    return storage.run(new Map(), fn);
  }
};

export default evaluatorContext;
