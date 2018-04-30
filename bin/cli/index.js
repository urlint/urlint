#!/usr/bin/env node

'use strict'

const normalizeUrl = require('normalize-url')
const { concat, first, isEmpty } = require('lodash')
const urlint = require('urlint')
const isCI = require('is-ci')
const got = require('got')

const pkg = require('../../package.json')
const extractUrls = require('./extract-urls')
const view = require('../view')

const getUrl = async input => {
  const normalizedUrl = normalizeUrl(input)
  const { url } = await got.head(normalizedUrl)
  return url
}

require('update-notifier')({ pkg }).notify()

const cli = require('meow')(require('./help'), {
  pkg,
  description: false,
  flags: {
    whitelist: {
      alias: 'w',
      type: 'array',
      default: false
    },
    concurrence: {
      alias: 'c',
      type: 'number',
      default: 30
    },
    quiet: {
      alias: 'q',
      type: 'boolean',
      default: isCI
    },
    followRedirect: {
      alias: 'f',
      type: 'boolean',
      default: true
    },
    logspeed: {
      alias: 's',
      type: 'number',
      default: 100
    },
    timeout: {
      alias: 't',
      type: 'number',
      default: false
    },
    retries: {
      alias: 'r',
      type: 'number',
      default: 2
    }
  }
})

if (isEmpty(cli.input)) {
  cli.showHelp()
  process.exit()
}

;(async () => {
  const url = await getUrl(first(cli.input))

  const opts = Object.assign({}, cli.flags, {
    whitelist: cli.flags.whitelist && concat(cli.flags.whitelist)
  })

  const urls = await extractUrls(url, opts)
  const emitter = await urlint(urls, opts)
  console.log()

  view({ emitter, ...opts })
})()
