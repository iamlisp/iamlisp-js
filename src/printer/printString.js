export default function printString(str) {
  return `"${str.replace('"', '\\"')}"`;
}
