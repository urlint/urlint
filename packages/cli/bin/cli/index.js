#!/usr/bin/env node

'use strict'

const cosmiconfig = require('cosmiconfig')('urlint')

const { omit, first, concat, isEmpty } = require('lodash')
const urlint = require('@urlint/core')
const { ci } = require('ci-env')

const beautyError = require('beauty-error')
const pkg = require('../../package.json')
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
      default: !isEmpty(ci)
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
      type: 'number',
      default: 100
    },
    prerender: {
      alias: 'p',
      default: 'auto'
    },
    timeout: {
      alias: 't',
      type: 'number',
      default: 30000
    },
    retries: {
      alias: 'r',
      type: 'number',
      default: 2
    }
  }
})

const main = async () => {
  const { config = {} } = (await cosmiconfig.search()) || {}
  const input = config.url || first(cli.input)

  if (isEmpty(input)) {
    cli.showHelp()
    await build.exit({ buildCode: 1, exitCode: 0 })
  }

  const flags = {
    ...omit(config, ['url']),
    ...cli.flags
  }

  const url = await getUrl(input)

  const opts = {
    ...flags,
    whitelist: flags.whitelist && concat(flags.whitelist)
  }

  await build.start()
  const emitter = await urlint(url, opts)
  view({ emitter, ...opts })
}

main().catch(async genericError => {
  console.error(beautyError(genericError))
  await build.exit({ buildCode: 1, exitCode: 1 })
})
