'use strict'

const createBrowserless = require('browserless')
const reachableUrl = require('reachable-url')
const dnsErrors = require('dnserrors')
const timeSpan = require('time-span')
const pick = require('lodash.pick')
const aigle = require('aigle')
const mitt = require('mitt')

const getStatusByGroup = statusCode => `${String(statusCode).charAt(0)}xx`

const prerender = browserless =>
  browserless.evaluate((page, response) => {
    const redirectChain = response.request().redirectChain()
    return {
      statusCode: response.status(),
      url: response.url(),
      redirectUrls: redirectChain.map(req => req.url()),
      redirectStatusCodes: redirectChain.map(req => req.response().status())
    }
  })

const withPrerender = async (requestUrl, { getBrowserless, ...opts }) => {
  const browserless = await getBrowserless()
  let timestamp = timeSpan()
  const res = await prerender(browserless)(requestUrl, opts)
  timestamp = timestamp()
  const data = { ...res, requestUrl, timestamp }
  return data
}

const withFetch = async (url, opts) => {
  let timestamp = timeSpan()
  const res = await reachableUrl(url, opts)
  timestamp = timestamp()

  return {
    ...pick(res, [
      'redirectStatusCodes',
      'redirectUrls',
      'url',
      'requestUrl',
      'statusCode'
    ]),
    timestamp
  }
}

const withError = (errors, props) => {
  const { statusCode = 500, url } = errors
    .map(dnsErrors)
    .find(error => !!error.url)

  return {
    url,
    requestUrl: url,
    redirectUrls: [],
    statusCode: statusCode,
    ...props
  }
}

const fetch = async (url, { getBrowserless = createBrowserless, ...opts }) => {
  let timestamp = timeSpan()

  try {
    return await withFetch(url, opts)
  } catch (aggregatedError) {
    const errors = Array.from(aggregatedError)
    const hasProtection = errors.some(({ statusCode }) => statusCode > 500)
    if (!hasProtection) return withError(errors, { timestamp: timestamp() })
    return withPrerender(url, { getBrowserless, ...opts })
  }
}

module.exports = async (urls, { concurrence = 8, ...opts } = {}) => {
  const emitter = mitt()

  async function iterator (acc, url) {
    emitter.emit('fetching', { url })
    const res = await fetch(url, opts)
    const statusCodeGroup = getStatusByGroup(
      res.redirectStatusCodes[0] || res.statusCode
    )
    const data = { ...res, statusCodeGroup }

    emitter.emit('status', data)
    if (!acc[statusCodeGroup]) acc[statusCodeGroup] = [data]
    else acc[statusCodeGroup].push(data)
  }

  aigle
    .transformLimit(urls, concurrence, iterator, {})
    .then(data => emitter.emit('end', data))

  return emitter
}
