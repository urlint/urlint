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
  const urls = ['https://httpbin.org/redirect/6']
  const emitter = await urlint(urls)
  const data = await pEvent(emitter, 'end')

  each(data, data => {
    const {
      redirectStatusCode,
      requestUrl,
      redirectUrls,
      statusCodeGroup,
      statusCode,
      url
    } = data
    t.is(statusCode, 200)
    t.is(redirectStatusCode, 302)
    t.is(statusCodeGroup, '3xx')
    t.is(requestUrl, 'https://httpbin.org/redirect/6')
    t.is(url, 'https://httpbin.org/get')
    t.deepEqual(redirectUrls, [
      'https://httpbin.org/relative-redirect/5',
      'https://httpbin.org/relative-redirect/4',
      'https://httpbin.org/relative-redirect/3',
      'https://httpbin.org/relative-redirect/2',
      'https://httpbin.org/relative-redirect/1',
      'https://httpbin.org/get'
    ])
  })
})
