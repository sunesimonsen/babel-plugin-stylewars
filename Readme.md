# babel-plugin-stylewars

A [Babel plugin](https://babeljs.io/docs/en/plugins) that minifies [Stylewars](https://github.com/sunesimonsen/stylewars) CSS templates.

## Installation

```
npm install babel-plugin-stylewars
```

## Usage


```json
{
  "plugins": ["stylewars"]
}
```

[See as an example.](https://github.com/sunesimonsen/depository/blob/main/examples/hackernews/.babelrc.json)

In minifies the code in place, so on input like this:

```js
const delay = '750ms';
const styles = css`
    & {
        animation: ${delay} linear 0s 1 normal none running &(fade-in);
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
`;
```

It will be transformed to this:

```js
const delay = '750ms';
const styles = css` &{animation:${delay} linear 0s 1 normal none running &(fade-in);}@keyframes &(fade-in){0%,60%{opacity:0;}100%{opacity:1;}}`;
```

## Acknowledgement

This code is mostly copied from [babel-plugin-styled-components](https://github.com/styled-components/babel-plugin-styled-components).

## MIT License

Copyright (c) 2021 Sune Simonsen <mailto:sune@we-knowhow.dk>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
