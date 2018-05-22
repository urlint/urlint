#!/usr/bin/env node

'use strict'

const { size, concat, isEmpty } = require('lodash')
const onExit = require('signal-exit')
const urlint = require('urlint')
const isCI = require('is-ci')

const extractUrls = require('./extract-urls')
const renderError = require('./render-error')
const createBuild = require('./create-build')
const pkg = require('../../package.json')
const getError = require('./get-error')
const getUrl = require('./get-url')
const view = require('../view')

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

;(async () => {
  try {
    const url = await getUrl(cli)
    const build = createBuild()

    onExit(async (code, signal) => {
      console.log('exiting with code', code)
      if (code === 0) await build.pass()
      if (code === 1) await build.fail()
      await build.error()
    })

    const opts = Object.assign({}, cli.flags, {
      whitelist: cli.flags.whitelist && concat(cli.flags.whitelist)
    })

    await build.start()
    const urls = await extractUrls(url, opts)
    const emitter = await urlint(urls, opts)
    view({ total: size(urls), emitter, ...opts })
  } catch (genericError) {
    const error = getError(genericError)
    const prettyError = renderError(error)
    console.log(prettyError)
    process.exit(1)
  }
})()
