'use strict'

const { isNumber, isString, forEach } = require('lodash')
const pEvent = require('p-event')
const test = require('ava')

const urlint = require('..')

const each = (data, fn) =>
  forEach(data, groupByStatusCode => forEach(groupByStatusCode, fn))

test('resolve a simple url', async t => {
  const emitter = urlint('https://kikobeats.com')
  const data = await pEvent(emitter, 'end')

  each(data, ({ statusCodeGroup, statusCode, url, timestamp }) => {
    t.true(isString(statusCodeGroup))
    t.true(isNumber(statusCode))
    t.true(isString(url))
    t.true(isNumber(timestamp))
  })
})

test('resolve a collection of urls', async t => {
  const emitter = urlint(['https://kikobeats.com', 'https://microlink.io'])
  const data = await pEvent(emitter, 'end')

  each(data, ({ statusCodeGroup, statusCode, url, timestamp }) => {
    t.true(isString(statusCodeGroup))
    t.true(isNumber(statusCode))
    t.true(isString(url))
    t.true(isNumber(timestamp))
  })
})

test('resolve DNS errors', async t => {
  const emitter = await urlint(
    'https://gist.githubusercontent.com/Kikobeats/1e9c32ca811a68f1ac80e41f8bef9901/raw/4ff2f5414d216306dbc677fc6da0c1fbe8f0bad5/dns-error.html'
  )
  const data = await pEvent(emitter, 'end')

  each(data, ({ statusCodeGroup, statusCode, url }) => {
    t.is(statusCode, 404)
    t.is(statusCodeGroup, '4xx')
  })
})

test('follow redirects', async t => {
  const emitter = await urlint(
    'https://gist.githubusercontent.com/Kikobeats/36587e833e76f57386ebe7a048b733c0/raw/2bca227045f3a0069be59b4235c6461dee4a6454/index.html'
  )

  const data = await pEvent(emitter, 'end')

  each(data, data => {
    const {
      redirectStatusCodes,
      requestUrl,
      redirectUrls,
      statusCodeGroup,
      statusCode,
      url
    } = data

    t.is(statusCode, 200)
    t.deepEqual(redirectStatusCodes, [302, 302, 302])
    t.is(statusCodeGroup, '3xx')
    t.is(requestUrl, 'https://httpbin-org.herokuapp.com/redirect/3')
    t.is(url, 'https://httpbin-org.herokuapp.com/get')
    t.deepEqual(redirectUrls, [
      'https://httpbin-org.herokuapp.com/redirect/3',
      'https://httpbin-org.herokuapp.com/relative-redirect/2',
      'https://httpbin-org.herokuapp.com/relative-redirect/1'
    ])
  })
})

test('prerendering support', async t => {
  const emitter = await urlint(
    'https://gist.githubusercontent.com/Kikobeats/1e9c32ca811a68f1ac80e41f8bef9901/raw/4ff2f5414d216306dbc677fc6da0c1fbe8f0bad5/prerender.html'
  )
  const data = await pEvent(emitter, 'end')

  each(data, data => {
    const {
      statusCodeGroup,
      statusCode,
      requestUrl,
      url,
      redirectStatusCodes,
      redirectUrls
    } = data
    t.is(statusCode, 200)
    t.is(statusCodeGroup, '2xx')
    t.true(url !== 'https://linkedin.com/in/kikobeats')
    t.is(requestUrl, 'https://es.linkedin.com/in/kikobeats')
    t.deepEqual(redirectStatusCodes, [])
    t.deepEqual(redirectUrls, [])
  })
})
