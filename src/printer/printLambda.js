import print from "./print";

export default function printLambda(lambda) {
  return `(lambda ${print(lambda.args)} ${lambda.body.map(print).join(" ")})`;
}
