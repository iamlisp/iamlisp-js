const color = code => ({
  open: `\u001B[${code}m`,
  close: "\u001B[39m"
});

export default {
  gray: color(90),
  green: color(32),
  red: color(31)
};
