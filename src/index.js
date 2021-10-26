const minify = require("./minify.js");

const babelPluginStylewars = ({ types }) => ({
  visitor: {
    TaggedTemplateExpression(path, state) {
      if (path.node.tag.name === "css") {
        minify(types)(path, state);
      }
    },
  },
});

module.exports = babelPluginStylewars;
