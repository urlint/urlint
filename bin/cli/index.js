#!/usr/bin/env node

'use strict'

const { chain, size, concat, first, isEmpty } = require('lodash')
const AggregateError = require('aggregate-error')
const normalizeUrl = require('normalize-url')
const reachableUrl = require('reachable-url')
const { STATUS_CODES } = require('http')
const dnsErrors = require('dnserrors')
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

const messageError = ({ errors, url: originalUrl }) => {
  return chain(errors)
    .first()
    .thru(err => {
      err = Object.assign({}, err, dnsErrors(err))
      const url = err.url || originalUrl
      const statusCode = err.statusCode || err.status
      const httpMessage = STATUS_CODES[statusCode] || 'Error'
      return { ...err, httpMessage, statusCode, url }
    })
    .thru(({ httpMessage, statusCode, method, url }) => {
      const status = statusCode ? `(${red(statusCode)}) ` : ''
      const message = status ? gray(httpMessage) : red(httpMessage)
      return `${gray(`${message} ${status}${normalizeUrl(url)}`)}`
    })
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
      default: 8
    },
    verbose: {
      alias: 'v',
      type: 'boolean',
      default: false
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

let url
;(async () => {
  try {
    url = first(cli.input)
    url = await getUrl(url)

    const opts = Object.assign({}, cli.flags, {
      whitelist: cli.flags.whitelist && concat(cli.flags.whitelist)
    })

    const urls = await extractUrls(url, opts)
    const emitter = await urlint(urls, opts)

    view({ total: size(urls), emitter, ...opts })
  } catch (error) {
    const errors = error instanceof AggregateError ? Array.from(error) : [error]
    const message = messageError({ errors, url })
    console.log(message)
    process.exit(1)
  }
})()
