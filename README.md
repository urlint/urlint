# urlint-core

![Last version](https://img.shields.io/github/tag/urlint/urlint-core.svg?style=flat-square)
[![Build Status](https://img.shields.io/travis/urlint/urlint-core/master.svg?style=flat-square)](https://travis-ci.org/urlint/urlint-core)
[![Coverage Status](https://img.shields.io/coveralls/urlint/urlint-core.svg?style=flat-square)](https://coveralls.io/github/urlint/urlint-core)
[![Dependency status](https://img.shields.io/david/urlint/urlint-core.svg?style=flat-square)](https://david-dm.org/urlint/urlint-core)
[![Dev Dependencies Status](https://img.shields.io/david/dev/urlint/urlint-core.svg?style=flat-square)](https://david-dm.org/urlint/urlint-core#info=devDependencies)
[![NPM Status](https://img.shields.io/npm/dm/urlint.svg?style=flat-square)](https://www.npmjs.org/package/urlint)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg?style=flat-square)](https://paypal.me/Kikobeats)

> Get all the links behind an url and classify them based on HTTP status code.

## Install

```bash
$ npm install @urlint/core --save
```

## Usage

```js
;(async () => {
  const url = 'https://kikobeats.com'
  const emitter = await urlint(url)

  emitter.on('*', function (event, data) {
    console.log(event, data)
  })

  emitter.on('end', function (data) {
    console.log('finished!')
  })
})()
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

**urlint** © [Kiko Beats](https://kikobeats.com), released under the [MIT](https://github.com/urlint/urlint-core/blob/master/LICENSE.md) License.<br>
Authored and maintained by Kiko Beats with help from [contributors](https://github.com/urlint/urlint-core/contributors).

> [kikobeats.com](https://kikobeats.com) · GitHub [@Kiko Beats](https://github.com/Kikobeats) · Twitter [@Kikobeats](https://twitter.com/Kikobeats)
