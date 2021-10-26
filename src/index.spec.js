const babel = require("@babel/core");
const unexpected = require("unexpected");
const unexpectedSnapshot = require("unexpected-snapshot");

const plugin = require("./index.js");

const expect = unexpected.clone().use(unexpectedSnapshot);

const transform = (input) =>
  babel.transformSync(input, {
    plugins: [plugin],
  }).code;

describe("babel-plugin-stylewars", () => {
  it("doesn't transform code without template strings", () => {
    expect(transform("const a = 1;"), "to equal snapshot", "const a = 1;");
  });

  it("doesn't transform code with template strings that isn't tagged", () => {
    expect(
      transform("const a = `foo`;"),
      "to equal snapshot",
      "const a = `foo`;"
    );
  });

  it("doesn't transform code with template strings that isn't tagged with css", () => {
    expect(
      transform("const a = html`<h1>Hello</h1>`;"),
      "to equal snapshot",
      "const a = html`<h1>Hello</h1>`;"
    );
  });

  it("minifies css tagged template strings", () => {
    const code = `
      const delay = '750ms';
      const styles = css\`
        & {
          animation: \${delay} linear 0s 1 normal none running &(fade-in);
        }

        @keyframes &(fade-in) {
          0%,
          60% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      \`;
    `;

    expect(
      transform(code),
      "to equal snapshot",
      expect.unindent`
        const delay = '750ms';
        const styles = css\` &{animation:\${delay} linear 0s 1 normal none running &(fade-in);}@keyframes &(fade-in){0%,60%{opacity:0;}100%{opacity:1;}}\`;
      `
    );
  });

  it("doesn't collapse whitespace inside of css strings", () => {
    const code = `
      const foo = css\`
        &:before {
          content: "this is 'some' \\"content\\"";
          background-color: yellow;
        }

        [data-foo="also: this"] & {
          background-color: orange;
        }
      \`;
    `;

    expect(
      transform(code),
      "to equal snapshot",
      'const foo = css` &:before{content:"this is \'some\' \\"content\\"";background-color:yellow;}[data-foo="also: this"] &{background-color:orange;}`;'
    );
  });
});
