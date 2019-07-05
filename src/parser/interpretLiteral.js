const looksLikeBoolean = exp => ["true", "false"].includes(exp);

const looksLikeNumber = exp => {
  if (exp.split(".").length > 2) {
    return false;
  }
  return !isNaN(parseFloat(exp));
};

const looksLikeNull = exp => exp === "null";

const looksLikeUndefined = exp => exp === "undefined";

export default function interpretLiteral(value) {
  let literal;
  let interpreted = false;

  if (looksLikeBoolean(value)) {
    interpreted = true;
    literal = value === "true";
  } else if (looksLikeNumber(value)) {
    interpreted = true;
    literal = parseFloat(value);
  } else if (looksLikeNull(value)) {
    interpreted = true;
    literal = null;
  } else if (looksLikeUndefined(value)) {
    interpreted = true;
    literal = undefined;
  }

  return [interpreted, literal];
}
