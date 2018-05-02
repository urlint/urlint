#!/usr/bin/env node

'use strict'

const { chain, size, concat, first, isEmpty } = require('lodash')
const normalizeUrl = require('normalize-url')
const reachableUrl = require('reachable-url')
const dnsErrors = require('dnserrors')
const { STATUS_CODES } = require('http')
const urlint = require('urlint')
const isCI = require('is-ci')

const { gray, red } = require('../view/colorize')
const extractUrls = require('./extract-urls')
const pkg = require('../../package.json')
const view = require('../view')

const getUrl = async input => {
  const normalizedUrl = normalizeUrl(input)
  const { url } = await reachableUrl(normalizedUrl)
  return url
}

const messageError = errors => {
  return chain(errors)
    .first()
    .thru(err => {
      err = dnsErrors(err)
      const statusCode = err.statusCode || err.status
      const httpMessage = STATUS_CODES[statusCode]
      return { ...err, httpMessage, statusCode }
    })
    .thru(
      ({ httpMessage, statusCode, method, url }) =>
        `${gray(`${httpMessage} (${red(statusCode)}) ${normalizeUrl(url)}`)}`
    )
    .value()
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
  try {
    const url = await getUrl(first(cli.input))

    const opts = Object.assign({}, cli.flags, {
      whitelist: cli.flags.whitelist && concat(cli.flags.whitelist)
    })

    const urls = await extractUrls(url, opts)
    const emitter = await urlint(urls, opts)

    view({ total: size(urls), emitter, ...opts })
  } catch (aggregatedError) {
    const error = chain(Array.from(aggregatedError))
    const message = messageError(error)
    console.log(message)
    process.exit(1)
  }
})()
