export class List {
  constructor(head, tail, empty) {
    this.head = head;
    this.tail = tail;
    this.empty = empty;
  }

  prepend(value) {
    return new Node(value, this);
  }

  *[Symbol.iterator]() {
    let curr = this;
    while (!curr.empty) {
      yield curr.head;
      curr = curr.tail;
    }
  }
}

export class Node extends List {
  constructor(head, tail) {
    super(head, tail, false);
  }
}

export const Nil = new (class extends List {
  constructor() {
    super(null, null, true);
  }
})();

export function fromArray(array) {
  return [...array].reverse().reduce((list, item) => list.prepend(item), Nil);
}

export function assertList(list) {
  if (!(list instanceof List)) {
    throw new TypeError(
      `Argument required to be type of List but ${typeof list} given`
    );
  }
}

export function toArray(arg) {
  if (Array.isArray(arg)) {
    return arg;
  }
  if (arg instanceof List) {
    const res = [];
    let list = arg;
    while (!list.empty) {
      res.push(list.head);
      list = list.tail;
    }
    return res;
  }
  throw new TypeError(`Could not convert to array`);
}
