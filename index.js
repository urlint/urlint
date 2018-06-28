'use strict'

const reachableUrl = require('reachable-url')
const isRedirect = require('is-redirect')
const dnsErrors = require('dnserrors')
const timeSpan = require('time-span')
const pick = require('lodash.pick')
const aigle = require('aigle')
const mitt = require('mitt')

const RESPONSE_PROPS = ['redirectUrls', 'url', 'requestUrl', 'statusCode']

const getStatusByGroup = statusCode => `${String(statusCode).charAt(0)}xx`

const withFetch = async (url, opts) => {
  let data
  let timestamp
  let statusCode

  timestamp = timeSpan()
  data = await reachableUrl(url, { ...opts, followRedirect: false })
  timestamp = timestamp()
  statusCode = data.statusCode
  if (!isRedirect(statusCode)) { return { ...pick(data, RESPONSE_PROPS), timestamp } }

  timestamp = timeSpan()
  data = await reachableUrl(url, opts)
  timestamp = timestamp()
  return {
    ...pick(data, RESPONSE_PROPS),
    redirectStatusCode: statusCode,
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

const fetch = async (url, opts) => {
  let timestamp = timeSpan()

  try {
    return await withFetch(url, opts)
  } catch (aggregatedError) {
    const errors = Array.from(aggregatedError)
    return withError(errors, { timestamp: timestamp() })
  }
}

module.exports = async (urls, { concurrence = 8, ...opts } = {}) => {
  const emitter = mitt()

  async function iterator (acc, url) {
    emitter.emit('fetching', { url })
    const res = await fetch(url, opts)
    const statusCodeGroup = getStatusByGroup(
      res.redirectStatusCode || res.statusCode
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
