'use strict'

const { isNumber, isString, forEach } = require('lodash')
const listen = require('test-listen')
const pEvent = require('p-event')
const test = require('ava')

const urlint = require('..')
const server = require('./server')

const each = (data, fn) => forEach(data, groupByStatusCode => forEach(groupByStatusCode, fn))

// test('resolve a simple url', async t => {
//   const emitter = urlint('https://kikobeats.com')
//   const data = await pEvent(emitter, 'end')

//   each(data, ({ statusCodeGroup, statusCode, url, timestamp }) => {
//     t.true(isString(statusCodeGroup))
//     t.true(isNumber(statusCode))
//     t.true(isString(url))
//     t.true(isNumber(timestamp))
//   })
// })

// test('resolve a collection of urls', async t => {
//   const emitter = urlint(['https://kikobeats.com', 'https://microlink.io'])
//   const data = await pEvent(emitter, 'end')

//   each(data, ({ statusCodeGroup, statusCode, url, timestamp }) => {
//     t.true(isString(statusCodeGroup))
//     t.true(isNumber(statusCode))
//     t.true(isString(url))
//     t.true(isNumber(timestamp))
//   })
// })

test('resolve DNS errors', async t => {
  const url = await listen(server.dnsError())
  const emitter = await urlint(url)
  t.snapshot(await pEvent(emitter, 'end'))
})

test('follow redirects', async t => {
  const url = await listen(server.followRedirects())
  const emitter = await urlint(url)
  t.snapshot(await pEvent(emitter, 'end'))
})

test('prerendering support', async t => {
  const url = await listen(server.prerender())
  const emitter = await urlint(url)
  t.snapshot(await pEvent(emitter, 'end'))
})
