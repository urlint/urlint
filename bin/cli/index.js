#!/usr/bin/env node

'use strict'

const cosmiconfig = require('cosmiconfig')('urlint')

const { first, size, concat, isEmpty } = require('lodash')
const urlint = require('@urlint/core')
const { ci } = require('ci-env')

const extractUrls = require('./extract-urls')
const renderError = require('./render-error')
const browserless = require('./browserless')
const pkg = require('../../package.json')
const getError = require('./get-error')
const getUrl = require('./get-url')
const build = require('./build')
const view = require('../view')

require('update-notifier')({ pkg }).notify()

const cli = require('meow')(require('./help'), {
  pkg,
  description: false,
  flags: {
    whitelist: {
      alias: 'w',
      type: 'array'
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
      default: !isEmpty(ci)
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
    prerender: {
      alias: 'p',
      type: 'boolean',
      default: 'auto'
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
;(async () => {
  const { config = {} } = (await cosmiconfig.search()) || {}
  const input = config.url || first(cli.input)

  try {
    if (isEmpty(input)) {
      cli.showHelp()
      await build.exit({ buildCode: 1, exitCode: 0 })
    }

    const flags = { ...config, ...cli.flags }
    const url = await getUrl(input)
    const opts = {
      ...flags,
      whitelist: flags.whitelist && concat(flags.whitelist)
    }

    await build.start()
    const urls = await extractUrls(url, opts)
    const emitter = await urlint(urls, { browserless, ...opts })
    view({ total: size(urls), emitter, ...opts })
  } catch (genericError) {
    const error = getError(genericError)
    const prettyError = renderError(error)
    console.log(prettyError)
    await build.exit({ buildCode: 1, exitCode: 1 })
  }
})()
