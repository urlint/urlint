'use strict'

const { chain, pick, omit, size, map, reduce } = require('lodash')
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
  const progress = total ? gray(`${current} of ${total}`) : ''
  return `${timestamp} ${spinnerFrame}${progress} ${url}`
}

const renderLink = (url, statusCode) => `${byStatusCode(statusCode)} ${url}`

const renderLinks = ({ count, links }, { omitErrors = false } = {}) => {
  const status = omitErrors ? omit(count, SUCCESS_STATUS_CODES) : count

  const info = map(status, (count, statusCode) => {
    const countByStatusCode = resumeCount(count, statusCode)
    const rows = map(
      links[statusCode],
      ({
        redirectStatusCodes,
        statusCode,
        url,
        requestUrl,
        timestamp,
        redirectUrls
      }) => {
        const links = chain(redirectUrls)
          .map((url, index) => renderLink(url, redirectStatusCodes[index]))
          .concat(renderLink(url, statusCode))
          .value()
        const colorTimestamp = getRequestColor(timestamp)
        const colorizeTimestamp = colorize[colorTimestamp](
          `+${prettyMs(timestamp)}`
        )
        return `${links.join(' → ')} ${colorizeTimestamp}`
      }
    ).join(EOL)
    return `${countByStatusCode}${EOL}${rows}${EOL}`
  }).join(EOL)

  return gray(info)
}

const renderCount = state => {
  const { count, end } = state

  const header = (() => {
    if (!size(count)) return ''
    const statusCodes = end ? pick(count, SUCCESS_STATUS_CODES) : count
    const statusCodesByCount = map(statusCodes, resumeCount).join(EOL)
    return `${EOL}${statusCodesByCount}${EOL}${EOL}`
  })()

  const links = end ? `${renderLinks(state, { omitErrors: true })}` : ''
  const footer = end ? renderTotal(state) : renderProgress(state)

  return `${header}${links}${footer}${EOL}`
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
