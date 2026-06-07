function toBytes(input) {
  if (typeof input === "string") {
    return Uint8Array.from(Buffer.from(input, "utf8"));
  }
  if (input instanceof Uint8Array) {
    return Uint8Array.from(input);
  }
  throw new TypeError("input must be a string, Buffer, or Uint8Array");
}

class Reader {
  #bytes;
  #offset = 0;

  constructor(input) {
    this.#bytes = toBytes(input);
  }

  get value() {
    return this.#bytes[this.#offset];
  }

  get eof() {
    return this.#offset >= this.#bytes.length;
  }

  get offset() {
    return this.#offset;
  }

  next() {
    if (!this.eof) {
      this.#offset += 1;
    }
    return this;
  }
}

module.exports = {
  Reader
};
