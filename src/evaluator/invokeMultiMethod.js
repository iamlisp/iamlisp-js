import invokeLambda from "./invokeLambda";

export default function invokeMultiMethod(
  multiMethod,
  [dispatchVal, ...argValues],
  strict
) {
  const lambda = multiMethod.methods.get(dispatchVal);

  if (lambda) {
    throw new TypeError(`Method not found for value "${dispatchVal}"`);
  }

  return invokeLambda(lambda, argValues, strict);
}
