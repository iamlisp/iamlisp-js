const keywordsSingletonsCache = new Map();

export default class Keyword {
  constructor(value) {
    if (value in keywordsSingletonsCache) {
      return keywordsSingletonsCache[value];
    }

    this.value = value;
    keywordsSingletonsCache.set(value, this);
  }

  valueOf() {
    return `:${this.value}`;
  }
}

Keyword.for = value => {
  if (!keywordsSingletonsCache.has(value)) {
    keywordsSingletonsCache.set(value, new Keyword(value));
  }

  return keywordsSingletonsCache.get(value);
};
