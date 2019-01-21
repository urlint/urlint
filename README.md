<h1 align="center">
  <img src="https://urlint.co/static/images/preview.jpg" alt="urlint">
</h1>

![Last version](https://img.shields.io/github/tag/urlint/urlint.svg?style=flat-square)
[![Build Status](https://img.shields.io/travis/urlint/urlint/master.svg?style=flat-square)](https://travis-ci.org/urlint/urlint)
[![Dependency status](https://img.shields.io/david/urlint/urlint.svg?style=flat-square)](https://david-dm.org/urlint/urlint)
[![Dev Dependencies Status](https://img.shields.io/david/dev/urlint/urlint.svg?style=flat-square)](https://david-dm.org/urlint/urlint#info=devDependencies)
[![NPM Status](https://img.shields.io/npm/dm/urlint.svg?style=flat-square)](https://www.npmjs.org/package/urlint)

## Features

- Get HTTP Status of the links on a website.
- XML support (RSS/Atom/Feed/Sitemap).
- Easy CI/CD integration.

## Usage

The nature of the program is to be used as CLI

```bash
$ npx urlint
```

We recommend execute it using `npx` over install it globally to have the benefits of the latest version.


Alternatively you can use it from Node.js

```js
const url = 'https://kikobeats.com'
const emitter = await urlint(url)

emitter.on('*', function (event, data) {
	console.log(event, data)
})

emitter.on('end', function (data) {
	console.log('finished!')
})
  ```

## API

### urlint(urls, [options])

#### urls

*Required*<br>
Type: `string`

The target URL.

#### options

##### concurrence

Type: `number`<br>
Default: `30`

The number of urls that can be resolved in parallel.


## License

**urlint** © [Kiko Beats](https://kikobeats.com), released under the [MIT](https://github.com/urlint/urlint/blob/master/LICENSE) License.<br>
Authored and maintained by Kiko Beats with help from [contributors](https://github.com/urlint/urlint/contributors).

> [kikobeats.com](https://kikobeats.com) · GitHub [@Kiko Beats](https://github.com/Kikobeats) · Twitter [@Kikobeats](https://twitter.com/Kikobeats)
