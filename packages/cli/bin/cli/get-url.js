'use strict'

const normalizedUrl = require('normalize-url')
const reachableUrl = require('reachable-url')

const getUrl = input =>
  normalizedUrl(
    input ||
      process.env.DEPLOY_URL ||
      process.env.DEPLOY_PRIME_URL ||
      process.env.URL
  )

module.exports = async input => {
  const targetUrl = getUrl(input)
  const { url } = await reachableUrl(targetUrl)
  return url
}
