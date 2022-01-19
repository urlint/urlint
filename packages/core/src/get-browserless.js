'use strict'

const creatBrowserlessFactory = opts => {
  const requireOneOf = require('require-one-of')
  const createBrowserless = requireOneOf(['@browserless/pool', 'browserless'])
  const exitHook = require('exit-hook')

  const browserlessFactory = createBrowserless(opts)
  exitHook(browserlessFactory.close)
  return browserlessFactory
}

let _browserlessFactory = null

module.exports = opts =>
  _browserlessFactory || (_browserlessFactory = creatBrowserlessFactory(opts))
