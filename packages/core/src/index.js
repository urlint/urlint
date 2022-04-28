'use strict'

const { concat, chain, first, pick } = require('lodash')
const reachableUrl = require('reachable-url')
const dnsErrors = require('dnserrors')
const timeSpan = require('time-span')
const isUrl = require('is-url-http')
const aigle = require('aigle')
const mitt = require('mitt')

const _getBrowserless = require('./get-browserless')
const getUrls = require('./get-urls')

const getStatusByGroup = statusCode => `${String(statusCode).charAt(0)}xx`

const getDnsError = errors =>
  chain(errors)
    .map(dnsErrors)
    .find(error => !!error.url)
    .thru(err => ({ statusCode: 500, ...err }))
    .pick(['statusCode', 'url'])
    .value()

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
  const browserless = await getBrowserless(requestUrl)
  return {
    ...(await prerender(browserless)(requestUrl, opts)),
    requestUrl
  }
}

const withFetch = async (url, opts) => {
  if (!isUrl(url)) {
    return url.startsWith('http')
      ? {
          redirectStatusCodes: [],
          redirectUrls: [],
          requestUrl: url,
          url,
          statusCode: 404
        }
      : {
          url,
          requestUrl: url,
          statusCode: 200,
          redirectStatusCodes: [],
          redirectUrls: []
        }
  }

  return pick(await reachableUrl(url, opts), [
    'redirectStatusCodes',
    'redirectUrls',
    'url',
    'requestUrl',
    'statusCode'
  ])
}

const withError = (errors, props) => {
  const { statusCode, url } = getDnsError(errors)

  return {
    url,
    requestUrl: url,
    redirectUrls: [],
    statusCode,
    ...props
  }
}

const doPing = async (url, opts) => {
  const timestamp = timeSpan()
  let res

  try {
    res = await withFetch(url, opts)
  } catch (fetchErrors) {
    try {
      res = await withPrerender(url, opts)
    } catch (prerenderErrors) {
      console.log(prerenderErrors)
      const errors = concat(Array.from(fetchErrors), Array.from(prerenderErrors))
      res = withError(errors)
    }
  }

  return { ...res, timestamp: timestamp() }
}

const pingUrl = async ({ acc, url, emitter, ...opts }) => {
  emitter.emit('fetching', { url })
  const res = await doPing(url, opts)
  const statusCodeGroup = getStatusByGroup(first(res.redirectStatusCodes) || res.statusCode)
  const data = { ...res, statusCodeGroup }

  emitter.emit('status', data)
  if (!acc[statusCodeGroup]) acc[statusCodeGroup] = [data]
  else acc[statusCodeGroup].push(data)
}

const pingUrls = async (urls, { emitter, concurrence, ...opts } = {}) =>
  aigle.transformLimit(urls, concurrence, (acc, url) => pingUrl({ acc, url, emitter, ...opts }), {})

module.exports = (
  urls,
  {
    emitter = mitt(),
    concurrence = require('os').cpus().length,
    getBrowserless = _getBrowserless,
    ...opts
  } = {}
) => {
  getUrls(urls, { getBrowserless, ...opts })
    .then(urls => {
      emitter.emit('urls', urls)
      return pingUrls(urls, { emitter, concurrence, getBrowserless, ...opts })
    })
    .then(data => emitter.emit('end', data))
    .catch(error => emitter.emit('error', error))

  return emitter
}
