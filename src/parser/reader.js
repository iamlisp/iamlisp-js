export default function createReader(str) {
  let offset = 0;

  const currentChar = () => str[offset];
  const isEof = () => offset >= str.length;
  const nextChar = () => (offset += 1);

  return {
    currentChar,
    isEof,
    nextChar
  };
}
