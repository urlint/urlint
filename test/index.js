'use strict'

const { isNumber, isString, forEach } = require('lodash')
const pEvent = require('p-event')
const test = require('ava')

const browserless = require('browserless')({
  ignoreHTTPSErrors: true,
  args: [
    '--disable-notifications',
    '--disable-offer-store-unmasked-wallet-cards',
    '--disable-offer-upload-credit-cards',
    '--disable-setuid-sandbox',
    '--enable-async-dns',
    '--enable-simple-cache-backend',
    '--enable-tcp-fast-open',
    '--media-cache-size=33554432',
    '--no-default-browser-check',
    '--no-pings',
    '--no-sandbox',
    '--no-zygote',
    '--prerender-from-omnibox=disabled',
    '--single-process'
  ]
})

const urlint = require('..')

const each = (data, fn) =>
  forEach(data, groupByStatusCode => forEach(groupByStatusCode, fn))

test('resolve an array of urls', async t => {
  const urls = ['https://kikobeats.com', 'https://microlink.io']

  const emitter = await urlint(urls, { browserless })
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
  const emitter = await urlint(urls, { browserless })
  const data = await pEvent(emitter, 'end')

  each(data, ({ statusCodeGroup, statusCode, url }) => {
    t.is(statusCode, 404)
    t.is(statusCodeGroup, '4xx')
  })
})

test('follow redirects', async t => {
  const urls = ['https://httpbin.org/redirect/6']
  const emitter = await urlint(urls, { browserless })
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

test('prerendering support', async t => {
  const urls = ['https://www.linkedin.com/in/kikobeats']
  const emitter = await urlint(urls, { browserless })
  const data = await pEvent(emitter, 'end')

  each(data, data => {
    const { statusCodeGroup, statusCode, requestUrl } = data
    t.is(statusCode, 200)
    t.is(statusCodeGroup, '2xx')
    t.is(requestUrl, 'https://www.linkedin.com/in/kikobeats')
  })
})
