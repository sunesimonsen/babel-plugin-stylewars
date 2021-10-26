const difference = require("lodash.difference");

// The capture group makes sure that the split contains the interpolation index
const placeholderRegex = /(?:__PLACEHOLDER_(\d+)__)/g;

// Alternative regex that splits without a capture group
const placeholderNonCapturingRegex = /__PLACEHOLDER_(?:\d+)__/g;

// Generates a placeholder from an index
const makePlaceholder = (index) => `__PLACEHOLDER_${index}__`;

// Splits CSS by placeholders
const splitByPlaceholders = ([css, ...rest], capture = true) => [
  css.split(capture ? placeholderRegex : placeholderNonCapturingRegex),
  ...rest,
];

const injectUniquePlaceholders = (strArr) => {
  let i = 0;

  return strArr.reduce((str, val, index, arr) => {
    return str + val + (index < arr.length - 1 ? makePlaceholder(i++) : "");
  }, "");
};

const symbolRegex = /(\s*[;:{},]\s*)/g;

// Counts occurences of substr inside str
const countOccurences = (str, substr) => str.split(substr).length - 1;

// Joins substrings until predicate returns true
const reduceSubstr = (substrs, join, predicate) => {
  const length = substrs.length;
  let res = substrs[0];

  if (length === 1) {
    return res;
  }

  for (let i = 1; i < length; i++) {
    if (predicate(res)) {
      break;
    }

    res += join + substrs[i];
  }

  return res;
};

const compressSymbols = (code) =>
  code.split(symbolRegex).reduce((str, fragment, index) => {
    // Even-indices are non-symbol fragments
    if (index % 2 === 0) {
      return str + fragment;
    }

    // Only manipulate symbols outside of strings
    if (
      countOccurences(str, "'") % 2 === 0 &&
      countOccurences(str, '"') % 2 === 0
    ) {
      return str + fragment.trim();
    }

    return str + fragment;
  }, "");

// Creates a minifier with a certain linebreak pattern
const minifyString = (linebreakPattern) => {
  const linebreakRegex = new RegExp(linebreakPattern + "\\s*", "g");

  return (code) => {
    const newCode = code
      .split(linebreakRegex) // Split at newlines
      .join(" "); // Rejoin all lines

    const eliminatedExpressionIndices = difference(
      code.match(placeholderRegex),
      newCode.match(placeholderRegex)
    ).map((x) => parseInt(x.match(/\d+/)[0], 10));

    return [compressSymbols(newCode), eliminatedExpressionIndices];
  };
};

const minifyRaw = minifyString("(?:\\\\r|\\\\n|\\r|\\n)");
const minifyCooked = minifyString("[\\r\\n]");

const minifyRawValues = (rawValues) =>
  splitByPlaceholders(minifyRaw(injectUniquePlaceholders(rawValues)), false);

const minifyCookedValues = (cookedValues) =>
  splitByPlaceholders(
    minifyCooked(injectUniquePlaceholders(cookedValues)),
    false
  );

const minify = (t) => (path, state) => {
  const templateLiteral = path.node.quasi;
  const quasisLength = templateLiteral.quasis.length;

  const [rawValuesMinified] = minifyRawValues(
    templateLiteral.quasis.map((x) => x.value.raw)
  );

  const [cookedValuesMinfified, eliminatedExpressionIndices] =
    minifyCookedValues(templateLiteral.quasis.map((x) => x.value.cooked));

  if (eliminatedExpressionIndices) {
    eliminatedExpressionIndices.forEach((expressionIndex, iteration) => {
      templateLiteral.expressions.splice(expressionIndex - iteration, 1);
    });
  }

  for (let i = 0; i < quasisLength; i++) {
    const element = templateLiteral.quasis[i];

    element.value.raw = rawValuesMinified[i];
    element.value.cooked = cookedValuesMinfified[i];
  }
};

module.exports = minify;
