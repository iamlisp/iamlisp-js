import { size } from "lodash";
import invokeLambda from "./invokeLambda";

export default function invokeOverloadedLambda(
  overloadedLambda,
  argValues,
  strict = true
) {
  const argValuesSize = size(argValues);
  const bestVariant = overloadedLambda.getVariant(argValuesSize);

  return invokeLambda(bestVariant, argValues, strict);
}
