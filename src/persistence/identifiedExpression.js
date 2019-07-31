import uuid from "uuid/v4";
import expressionId from "./expressionId";

export default function identifiedExpression(...args) {
  const arr = [...args];
  arr[expressionId] = uuid();
  return arr;
}
