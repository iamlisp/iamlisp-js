export default function printMeta(metaExpr) {
  return `^${print(metaExpr[1])} ${print(metaExpr[2])}`;
}
