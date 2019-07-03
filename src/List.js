export class List {
  constructor(head, tail, empty) {
    this.head = head;
    this.tail = tail;
    this.empty = empty;
  }

  prepend(value) {
    return new Node(value, this);
  }
}

class Node extends List {
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
