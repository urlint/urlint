'use strict'

const normalizeUrl = require('normalize-url')
const reachableUrl = require('reachable-url')
const { first } = require('lodash')

const getUrl = cli =>
  first(cli.input) ||
  process.env.DEPLOY_URL ||
  process.env.DEPLOY_PRIME_URL ||
  process.env.URL

module.exports = async cli => {
  const targetUrl = getUrl(cli)
  const normalizedUrl = normalizeUrl(targetUrl)
  const { url } = await reachableUrl(normalizedUrl)
  return url
}
