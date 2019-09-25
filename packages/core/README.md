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
  const urlint = require('@urlint/core')
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
Type: `string|string[]`

The target URL(s) for detecting content.

#### options

##### concurrence

Type: `number`<br>
Default: `8`

The number of URLs that can be resolved in parallel.

##### quiet

Type: `boolean`<br>
Default: `false`

When is `true`, it avoid print progress on terminal. This is oriented for CI environment and the value will be automatically inferred.

##### verbose

Type: `boolean`<br>
Default: `false`

When is `true`, it will be print more detailed information per every link as output.

##### prerender

Type: `string|boolean`<br>
Default: `auto`<br>
Values: `auto|true|false`

Get HTML markup from the target URL using prerendering.

##### retries

Type: `number`<br>
Default: `2`

Maximum quantity of retries to do per every link after consider the URL is not reachable.

##### timeout

Type: `timeout`<br>
Default: `30000`

Maximum quanitty of time in milliseconds to wait until consider the URL is not reachable.

##### followRedirect

Type: `boolean`<br>
Default: `true`

Defines if redirect responses should be followed automatically.

##### whitelist

Type: `string[]`

A set of URLs that can be ignored.

##### selector

Type: `string`

Specify a CSS Classname selector for getting the URLs from HTML markup.Specify a CSS Classname selector for getting the URLs from HTML markup.

## License

**urlint** © [Kiko Beats](https://kikobeats.com), released under the [MIT](https://github.com/urlint/urlint-core/blob/master/LICENSE.md) License.<br>
Authored and maintained by Kiko Beats with help from [contributors](https://github.com/urlint/urlint-core/contributors).

> [kikobeats.com](https://kikobeats.com) · GitHub [@Kiko Beats](https://github.com/Kikobeats) · Twitter [@Kikobeats](https://twitter.com/Kikobeats)
