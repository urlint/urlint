'use strict'

const { isNumber, isString, forEach } = require('lodash')
const pEvent = require('p-event')
const test = require('ava')

const urlint = require('..')

test('Resolve an array of urls', async t => {
  const urls = ['https://kikobeats.com', 'https://microlink.io']

  const emitter = await urlint(urls)
  const data = await pEvent(emitter, 'end')

  forEach(data, groupByStatusCode => {
    forEach(
      groupByStatusCode,
      ({ statusCodeGroup, statusCode, url, timestamp }) => {
        t.is(true, isString(statusCodeGroup))
        t.is(true, isNumber(statusCode))
        t.is(true, isString(url))
        t.is(true, isNumber(timestamp))
      }
    )
  })
})
