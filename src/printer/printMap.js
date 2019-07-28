export default function printMap(map) {
  return `{${[...map.entries()]
    .map(([key, value]) => `${print(key)} ${print(value)}`)
    .join(" ")}}`;
}
