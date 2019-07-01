import { size } from "lodash";

const isEven = n => n % 2 === 0;

export default function splitDefinition(defs) {
  const initArgNames = [];
  const initArgValues = [];

  for (let i = 0; i < size(defs); i += 1) {
    if (isEven(i)) {
      initArgNames.push(defs[i]);
    } else {
      initArgValues.push(defs[i]);
    }
  }

  return [initArgNames, initArgValues];
}
