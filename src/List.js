export class List {
  constructor(head, tail) {
    this.head = head;
    this.tail = tail;
    this.empty = false;
  }

  prepend(value) {
    return new List(value, this);
  }
}

class EmptyList extends List {
  constructor() {
    super(null, null);
    this.empty = true;
  }
}

export const Nil = new EmptyList();

export function fromArray(array) {
  return [...array].reverse().reduce((list, item) => list.prepend(item), Nil);
}
