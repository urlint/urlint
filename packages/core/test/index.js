'use strict'

process.setMaxListeners(Infinity)

const { isNumber, isString, forEach } = require('lodash')
const listen = require('test-listen')
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
  const url = await listen(server.dnsError())
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
  const url = await listen(server.followRedirects())
  const emitter = await urlint(url)
  const data = await pEvent(emitter, 'end')

  each(data, data => {
    const { redirectStatusCodes, requestUrl, redirectUrls, statusCodeGroup, statusCode, url } = data

    if (url === 'https://httpbin.org/get') {
      t.is(statusCode, 200)
      t.deepEqual(redirectStatusCodes, [302, 302, 302])
      t.is(statusCodeGroup, '3xx')
      t.is(requestUrl, 'https://httpbin.org/redirect/3')
      t.is(url, 'https://httpbin.org/get')
      t.deepEqual(redirectUrls, [
        'https://httpbin.org/redirect/3',
        'https://httpbin.org/relative-redirect/2',
        'https://httpbin.org/relative-redirect/1'
      ])
    }
  })
})

test('prerendering support', async t => {
  const url = await listen(server.prerender())
  const emitter = await urlint(url)
  const data = await pEvent(emitter, 'end')

  each(data, data => {
    const { statusCodeGroup, statusCode, requestUrl, url, redirectStatusCodes, redirectUrls } = data

    if (url.includes('instagram')) {
      t.is(statusCode, 200)
      t.is(statusCodeGroup, '2xx')
      t.true(url === 'https://www.instagram.com/teslamotors/')
      t.is(requestUrl, 'https://www.instagram.com/teslamotors/')
      t.deepEqual(redirectStatusCodes, [])
      t.deepEqual(redirectUrls, [])
    }
  })
})
