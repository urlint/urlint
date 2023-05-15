'use strict'

process.setMaxListeners(Infinity)

const { isNumber, isString, forEach } = require('lodash')
const { listen } = require('async-listen')
const pEvent = require('p-event')
const test = require('ava')

const urlint = require('..')
const server = require('./server')

const each = (data, fn) => forEach(data, groupByStatusCode => forEach(groupByStatusCode, fn))

test('resolve a simple url', async t => {
  const emitter = urlint('https://kikobeats.com', { timeout: 5000 })
  const data = await pEvent(emitter, 'end')

  each(data, ({ statusCodeGroup, statusCode, url, timestamp }) => {
    t.true(isString(statusCodeGroup))
    t.true(isNumber(statusCode))
    t.true(isString(url))
    t.true(isNumber(timestamp))
  })
})

test('resolve a collection of urls', async t => {
  const emitter = urlint(['https://kikobeats.com', 'https://microlink.io'], { timeout: 5000 })
  const data = await pEvent(emitter, 'end')

  each(data, ({ statusCodeGroup, statusCode, url, timestamp }) => {
    t.true(isString(statusCodeGroup))
    t.true(isNumber(statusCode))
    t.true(isString(url))
    t.true(isNumber(timestamp))
  })
})

test('resolve DNS errors', async t => {
  const url = (await listen(server.dnsError())).toString()
  const emitter = await urlint(url)
  const data = await pEvent(emitter, 'end')

  each(data, ({ statusCodeGroup, statusCode, url }) => {
    if (url.includes('android-app')) {
      t.is(statusCode, 404)
      t.is(statusCodeGroup, '4xx')
    }
  })
})

test('follow redirects', async t => {
  const url = (await listen(server.followRedirects())).toString()
  const emitter = await urlint(url)
  const data = await pEvent(emitter, 'end')

  each(data, data => {
    const { redirectStatusCodes, requestUrl, redirectUrls, statusCodeGroup, statusCode, url } = data

    if (url === 'https://example.com/') {
      t.is(statusCode, 200)
      t.deepEqual(redirectStatusCodes, [302, 302, 302])
      t.is(statusCodeGroup, '3xx')
      t.is(
        requestUrl,
        'https://test-redirect-drab.vercel.app/?url=https%3A%2F%2Ftest-redirect-drab.vercel.app%3Furl%3Dhttps%253A%252F%252Ftest-redirect-drab.vercel.app%252F%253Furl%253Dhttps%253A%252F%252Fexample.com'
      )
      t.is(url, 'https://example.com/')
      t.deepEqual(redirectUrls, [
        'https://test-redirect-drab.vercel.app/?url=https%3A%2F%2Ftest-redirect-drab.vercel.app%3Furl%3Dhttps%253A%252F%252Ftest-redirect-drab.vercel.app%252F%253Furl%253Dhttps%253A%252F%252Fexample.com',
        'https://test-redirect-drab.vercel.app/?url=https%3A%2F%2Ftest-redirect-drab.vercel.app%2F%3Furl%3Dhttps%3A%2F%2Fexample.com',
        'https://test-redirect-drab.vercel.app/?url=https://example.com'
      ])
    }
  })
})

test('resolve data URIs', async t => {
  const url = (await listen(server.dataUris())).toString()
  const emitter = await urlint(url)
  const data = await pEvent(emitter, 'end')

  each(data, data => {
    const { statusCodeGroup, statusCode, requestUrl, url, redirectStatusCodes, redirectUrls } = data

    if (url.startsWith('data:image/jpeg;base64')) {
      t.is(statusCode, 200)
      t.is(statusCodeGroup, '2xx')
      t.true(url === requestUrl)
      t.deepEqual(redirectStatusCodes, [])
      t.deepEqual(redirectUrls, [])
    }
  })
})

test('resolve CDNs URLs', async t => {
  const url = (await listen(server.cdnUrls())).toString()
  const emitter = await urlint(url)
  const data = await pEvent(emitter, 'end')

  each(data, data => {
    const { statusCodeGroup, statusCode, requestUrl, url, redirectStatusCodes, redirectUrls } = data

    if (url.startsWith('https://cdn')) {
      t.is(statusCode, 200)
      t.is(statusCodeGroup, '3xx')
      t.is(requestUrl, 'http://cdn.jsdelivr.net/npm/@microlink/mql@0.6.11/src/browser.js')
      t.is(url, 'https://cdn.jsdelivr.net/npm/@microlink/mql@0.6.11/src/browser.js')
      t.deepEqual(redirectStatusCodes, [301])
      t.deepEqual(redirectUrls, [
        'http://cdn.jsdelivr.net/npm/@microlink/mql@0.6.11/src/browser.js'
      ])
    }
  })
})

test('resolve mailto', async t => {
  const url = (await listen(server.mailTo())).toString()
  const emitter = await urlint(url)
  const data = await pEvent(emitter, 'end')

  each(data, data => {
    const { statusCodeGroup, statusCode, requestUrl, url, redirectStatusCodes, redirectUrls } = data

    if (url.includes('kikobeats.com')) {
      t.is(statusCode, 200)
      t.is(statusCodeGroup, '3xx')
      t.is(requestUrl, 'http://kikobeats.com/')
      t.is(url, 'https://kikobeats.com/')
      t.deepEqual(redirectStatusCodes, [301])
      t.deepEqual(redirectUrls, ['http://kikobeats.com/'])
    }
  })
})

test.todo('resolve URLs inside common meta tags (https://github.com/Kikobeats/html-urls/issues/46)')
test.todo('resolve anchor URLs (https://github.com/urlint/urlint/issues/122)')
test.todo('resolve URLs inside dynamic scripts (https://github.com/urlint/urlint/issues/32)')
test.todo('resolve URLs based on a deep level (https://github.com/urlint/urlint/issues/70)')
