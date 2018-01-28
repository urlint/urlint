'use strict'

const pEvent = require('p-event')
const test = require('ava')

const urlint = require('..')

test('Get all URLS from an URL', async t => {
  const url = 'http://example.com'
  const emitter = await urlint(url)
  const data = await pEvent(emitter, 'end')
  t.snapshot(data)
})
