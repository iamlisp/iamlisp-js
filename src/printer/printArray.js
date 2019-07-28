import print from "./print";

export default function printArray(list) {
  return `(${list.map(print).join(" ")})`;
}
