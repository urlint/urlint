#!/usr/bin/env node
'use strict'

const normalizeUrl = require('normalize-url')
const { first, size, isEmpty } = require('lodash')
const urlint = require('urlint')

const pkg = require('../../package.json')
const getUrls = require('./get-urls')
const view = require('../view')

require('update-notifier')({ pkg }).notify()

const cli = require('meow')(require('./help'), {
  pkg,
  description: false,
  flags: {
    whitelist: {
      alias: 'w',
      type: 'array',
      default: []
    },
    concurrence: {
      alias: 'c',
      type: 'number',
      default: 30
    }
  }
})

if (isEmpty(cli.input)) {
  cli.showHelp()
  process.exit()
}

const url = normalizeUrl(first(cli.input))

const opts = Object.assign({}, cli.flags, {
  whitelist: [].concat(cli.flags.whitelist)
})
;(async () => {
  const urls = await getUrls(url, opts)
  const emitter = await urlint(urls, opts)

  console.log()
  view({ emitter, ...opts })

  emitter.on('end', data => {
    const exitCode = size(data) > 1 ? 1 : 0
    setTimeout(process.exit, 300, exitCode)
  })
})()
