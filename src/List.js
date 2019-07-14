export class List {
  constructor(head, tail, empty) {
    this.head = head;
    this.tail = tail;
    this.empty = empty;
  }

  prepend(value) {
    return new Node(value, this);
  }

  toArray() {
    const result = [];
    let list = this;
    while (!list.empty) {
      result.push(list.head);
      list = list.tail;
    }
    return result;
  }

  reverse() {
    let result = Nil;
    let list = this;
    while (!list.empty) {
      result = result.prepend(list.head);
      list = list.tail;
    }
    return result;
  }
}

List.fromArray = array => {
  return array.reduce((list, item) => list.prepend(item), Nil).reverse();
};

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
