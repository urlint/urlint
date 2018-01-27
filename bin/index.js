#!/usr/bin/env node
'use strict'

const { size } = require('lodash')
const urlint = require('urlint')
const path = require('path')

const componentPath = path.join(__dirname, './component.js')
const pkg = require('../package.json')
const mount = require('./mount')

require('update-notifier')({ pkg }).notify()

const cli = require('meow')(require('./help'), {
  pkg,
  description: false,
  flags: {
    ignore: {
      alias: 'i',
      type: 'array',
      default: []
    }
  }
})

if (cli.input.length === 0) {
  cli.showHelp()
  process.exit()
}

const [url] = cli.input
const { flags } = cli
const { ignore, ...opts } = flags

const whitelist = [].concat(ignore)
;(async () => {
  const emitter = await urlint(url, Object.assign({ whitelist }, opts))
  console.log()
  mount(componentPath, { emitter, ...opts })

  emitter.on('end', data => {
    const exitCode = size(data) > 1 ? 1 : 0
    setTimeout(process.exit, 300, exitCode)
  })
})()
