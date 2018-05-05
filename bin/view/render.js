'use strict'

const { pick, omit, size, concat, map, reduce } = require('lodash')
const spinner = require('ora')({ text: '', color: 'gray' })
const prettyMs = require('pretty-ms')
const { EOL } = require('os')

const colorize = require('./colorize')
const { SUCCESS_STATUS_CODES } = require('./constant')
const { blue, gray, byStatusCode, getRequestColor } = colorize

const resumeCount = (count, statusCode) =>
  byStatusCode(statusCode, `${statusCode} ${count}`)

const renderTotal = ({ startTimestamp, count }) => {
  const total = reduce(count, (acc, count) => acc + count, 0)
  const timestamp = prettyMs(Date.now() - startTimestamp)
  return gray(`${total} links in ${timestamp}`)
}

const renderProgress = ({ fetchingUrl, current, total, startTimestamp }) => {
  const timestamp = blue(prettyMs(Date.now() - startTimestamp))
  const spinnerFrame = spinner.frame()
  const url = gray(fetchingUrl)
  const progress = gray(`${current} of ${total}`)

  return `${timestamp} ${spinnerFrame}${progress} ${url}`
}

const renderLinks = ({ count, links }, { omitErrors = false } = {}) => {
  const status = omitErrors ? omit(count, SUCCESS_STATUS_CODES) : count

  const info = map(status, (count, statusCode) => {
    const countByStatusCode = resumeCount(count, statusCode)

    const rows = map(
      links[statusCode],
      ({
        redirectStatusCode,
        statusCode,
        requestUrl,
        timestamp,
        redirectUrls
      }) => {
        const colorizeStatusCode = byStatusCode(
          redirectStatusCode || statusCode
        )
        const colorTimestamp = getRequestColor(timestamp)
        const colorizeTimestamp = colorize[colorTimestamp](
          `+${prettyMs(timestamp)}`
        )

        const urls = concat(requestUrl, redirectUrls)
        const sizeRedirectUrls = size(redirectUrls)
        const redirects = urls.join(' → ')
        const nRedirects = sizeRedirectUrls > 0 ? `(${sizeRedirectUrls}) ` : ''

        return `${colorizeStatusCode} ${nRedirects}${redirects} ${colorizeTimestamp}`
      }
    ).join(EOL)
    return `${countByStatusCode}${EOL}${rows}${EOL}`
  }).join(EOL)

  return gray(info)
}

const renderCount = state => {
  const { count, end } = state

  const total = end ? renderTotal(state) : renderProgress(state)

  const header = (() => {
    if (!size(count)) return ''
    const statusCodes = end ? pick(count, SUCCESS_STATUS_CODES) : count
    const statusCodesByCount = map(statusCodes, resumeCount).join(EOL)
    return `${EOL}${statusCodesByCount}${EOL}`
  })()

  const footer = `${EOL}${total}`
  const links = end ? `${EOL}${renderLinks(state, { omitErrors: true })}` : ''

  return `${header}${links}${footer}`
}

const renderResume = state => {
  const links = renderLinks(state)
  const total = renderTotal(state)

  return gray(`${EOL}${links}${EOL}${total}`)
}

module.exports = state => {
  const { verbose, quiet, end } = state

  if (!verbose) {
    if (quiet) return end ? renderCount(state) : ''
    return renderCount(state)
  }

  if (quiet) return end ? renderResume(state) : ''
  return end ? renderResume(state) : renderCount(state)
}

module.exports.count = renderCount
module.exports.resume = renderResume
