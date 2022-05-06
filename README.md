<h1 align="center">
  <img src="https://urlint.co/static/images/preview.jpg" alt="urlint">
</h1>

![Last version](https://img.shields.io/github/tag/urlint/urlint.svg?style=flat-square)
[![Coverage Status](https://img.shields.io/coveralls/urlint/urlint.svg?style=flat-square)](https://coveralls.io/github/urlint/urlint)
[![NPM Status](https://img.shields.io/npm/dm/urlint.svg?style=flat-square)](https://www.npmjs.org/package/urlint)

## Features

- Collect all the links behind a URL.
- Get HTTP status code and group (2xx, 3xx, etc) per every link.
- HTML & XML (RSS/Atom/Feed/Sitemap) markup supported.
- Universal UNIX interface, easy to integrate with any existence system or tooling.

## Usage

### as CLI

The nature of the program is to be used as CLI:

```bash
$ npx urlint
```

We recommend execute it using `npx` over install it globally to have the benefits of the latest version.

Also, the CLI supports load the configuration via:

- A `.urlintrc` file, written in YAML or JSON, with optional extensions: .yaml/.yml/.json/.js.
- A `urlint.config.js` file that exports an object.
- A `urlint` key in your package.json file.

See [options](/packages/core/README.md#options) to know what kind of settings can be place there.

### as Node.js module

Alternatively you can use it from Node.js.

See [`@urlint/core`](/packages/core/README.md) to know more.

## License

**urlint** © [Kiko Beats](https://kikobeats.com), released under the [MIT](https://github.com/urlint/urlint/blob/master/LICENSE) License.<br>
Authored and maintained by Kiko Beats with help from [contributors](https://github.com/urlint/urlint/contributors).

> [kikobeats.com](https://kikobeats.com) · GitHub [@Kiko Beats](https://github.com/Kikobeats) · Twitter [@Kikobeats](https://twitter.com/Kikobeats)
