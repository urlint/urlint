'use strict'

const pEvent = require('p-event')
const test = require('ava')

const urlint = require('..')

test('Resolve an array of urls', async t => {
  const urls = [
    'https://kikobeats.com',
    'https://microlink.io'
  ]

  const emitter = await urlint(urls)
  const data = await pEvent(emitter, 'end')
  t.snapshot(data)
})
