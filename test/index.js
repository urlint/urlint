'use strict'

const { isNumber, isString, forEach } = require('lodash')
const pEvent = require('p-event')
const test = require('ava')

const urlint = require('..')

const each = (data, fn) =>
  forEach(data, groupByStatusCode => forEach(groupByStatusCode, fn))

test('resolve an array of urls', async t => {
  const urls = ['https://kikobeats.com', 'https://microlink.io']

  const emitter = await urlint(urls)
  const data = await pEvent(emitter, 'end')

  each(data, ({ statusCodeGroup, statusCode, url, timestamp }) => {
    t.true(isString(statusCodeGroup))
    t.true(isNumber(statusCode))
    t.true(isString(url))
    t.true(isNumber(timestamp))
  })
})

test('resolve DNS errors', async t => {
  const urls = [
    'http://android-app/com.twitter.android/twitter/user?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eandroidseo%7Ctwgr%5Eprofile&screen_name=Kikobeats'
  ]
  const emitter = await urlint(urls)
  const data = await pEvent(emitter, 'end')

  each(data, ({ statusCodeGroup, statusCode, url }) => {
    t.is(statusCode, 404)
    t.is(statusCodeGroup, '4xx')
  })
})

test('follow redirects', async t => {
  const urls = ['https://httpbin-org.herokuapp.com/redirect/3']
  const emitter = await urlint(urls)
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
  const urls = ['https://es.linkedin.com/in/kikobeats']
  const emitter = await urlint(urls)
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
