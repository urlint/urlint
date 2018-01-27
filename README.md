# urlint

![Last version](https://img.shields.io/github/tag/urlint/urlint.svg?style=flat-square)
[![Build Status](https://img.shields.io/travis/urlint/urlint/master.svg?style=flat-square)](https://travis-ci.org/urlint/urlint)
[![Coverage Status](https://img.shields.io/coveralls/urlint/urlint.svg?style=flat-square)](https://coveralls.io/github/urlint/urlint)
[![Dependency status](https://img.shields.io/david/urlint/urlint.svg?style=flat-square)](https://david-dm.org/urlint/urlint)
[![Dev Dependencies Status](https://img.shields.io/david/dev/urlint/urlint.svg?style=flat-square)](https://david-dm.org/urlint/urlint#info=devDependencies)
[![NPM Status](https://img.shields.io/npm/dm/urlint.svg?style=flat-square)](https://www.npmjs.org/package/urlint)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg?style=flat-square)](https://paypal.me/Kikobeats)

> Get all the links behind an url and classify them based on HTTP status code.

## Install

```bash
$ npm install urlint --save
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

### urlint(url, [options])

#### url

*Required*<br>
Type: `string`

The target URL.

#### options

##### foo

Type: `boolean`<br>
Default: `false`

Lorem ipsum.

## License

**urlint** © [Kiko Beats](https://kikobeats.com), released under the [MIT](https://github.com/urlint/urlint/blob/master/LICENSE.md) License.<br>
Authored and maintained by Kiko Beats with help from [contributors](https://github.com/urlint/urlint/contributors).

> [kikobeats.com](https://kikobeats.com) · GitHub [@Kiko Beats](https://github.com/Kikobeats) · Twitter [@Kikobeats](https://twitter.com/Kikobeats)
