#!/usr/bin/env node

'use strict'

const { size, concat, first, isEmpty } = require('lodash')
const AggregateError = require('aggregate-error')
const normalizeUrl = require('normalize-url')
const reachableUrl = require('reachable-url')
const urlint = require('urlint')
const isCI = require('is-ci')

const extractUrls = require('./extract-urls')
const renderError = require('./render-error')
const pkg = require('../../package.json')
const view = require('../view')

const getUrl = async input => {
  const normalizedUrl = normalizeUrl(input)
  const { url } = await reachableUrl(normalizedUrl)
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
      default: 8
    },
    selector: {
      alias: 's',
      type: 'string'
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
  } catch (genericError) {
    const errors =
      genericError instanceof AggregateError
        ? Array.from(genericError)
        : [genericError]
    const error = first(errors)
    const prettyError = renderError(error)

    console.log(prettyError)
    process.exit(1)
  }
})()
