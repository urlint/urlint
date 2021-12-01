#!/usr/bin/env node

'use strict'

const { omit, concat, isEmpty } = require('lodash')
const urlint = require('@urlint/core')
const JoyCon = require('joycon')
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

const joycon = new JoyCon({
  packageKey: 'urlint',
  files: ['package.json', '.urlintrc', '.urlintrc.json', '.urlintrc.js', 'urlint.config.js']
})

const main = async () => {
  const { data: config } = await joycon.load()

  const input = config.url || cli.input

  if (isEmpty(input)) {
    cli.showHelp()
    await build.exit({ buildCode: 1, exitCode: 0 })
  }

  const flags = {
    ...omit(config, ['url']),
    ...cli.flags
  }

  const url = getUrl(input)

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
