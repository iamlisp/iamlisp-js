import Keyword from "../types/Keyword";

const looksLikeBoolean = exp => ["true", "false"].includes(exp);

const looksLikeNumber = exp => {
  if (exp.split(".").length > 2) {
    return false;
  }
  return !isNaN(parseFloat(exp));
};

const looksLikeNull = exp => exp === "null";

const looksLikeUndefined = exp => exp === "undefined";

const looksLikeKeyword = exp => /^:[^:]+/.test(exp);

export default function interpretLiteral(value) {
  let literal;
  let interpreted = false;

  if (looksLikeKeyword(value)) {
    interpreted = true;
    literal = Keyword.for(value.slice(1));
  } else if (looksLikeBoolean(value)) {
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
