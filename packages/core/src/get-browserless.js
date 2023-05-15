'use strict'

const creatBrowserlessFactory = opts => {
  const requireOneOf = require('require-one-of')
  const createBrowserless = requireOneOf(['@browserless/pool', 'browserless'])
  const { onExit } = require('signal-exit')

  const browserlessFactory = createBrowserless(opts)
  onExit(browserlessFactory.close)
  return browserlessFactory
}

let _browserlessFactory = null

module.exports = opts =>
  _browserlessFactory || (_browserlessFactory = creatBrowserlessFactory(opts))
