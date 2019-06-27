export const chars = {
  LEFT_PAREN: "(",
  RIGHT_PAREN: ")",
  DOUBLE_QUOTE: '"',
  SINGLE_QUOTE: "'",
  BACKSLASH: "\\",
  SPACE: " ",
  TAB: "\t",
  LINE_FEED: "\n",
  CARRIAGE_RETURN: "\r"
};

export const reserved = new Set(Object.values(chars));

export const delimiters = new Set([
  chars.SPACE,
  chars.TAB,
  chars.LINE_FEED,
  chars.CARRIAGE_RETURN
]);
