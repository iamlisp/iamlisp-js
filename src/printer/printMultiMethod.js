import print from "./print";

export default function printMultiMethod(mm) {
  return `(multi ${print(mm.dispatchFn)})`;
}
