'use strict'

const { concat, toNumber, first, chain, map, reduce } = require('lodash')
const prettyMs = require('pretty-ms')
const { EOL } = require('os')

const spinner = require('ora')({ text: '', color: 'gray' })

const colorize = require('./colorize')
const { green, blue, gray, byStatusCode, getRequestColor } = colorize

const resumeCount = (count, statusCode) =>
  byStatusCode(statusCode, `${statusCode} ${count}`)

const sortByStatusCode = data =>
  chain(data)
    .toPairs()
    .sortBy(pair => {
      const statusCode = first(pair)
      return toNumber(statusCode.charAt(0))
    })
    .fromPairs()
    .value()

const renderCount = state => {
  const { count, fetchingUrl, startTimestamp, current, total } = state
  const countByStatusCode = map(count, resumeCount).join(EOL) || green(0)
  const spinnerFrame = spinner.frame()
  const timestamp = blue(prettyMs(Date.now() - startTimestamp))
  const url = gray(fetchingUrl)
  const progress = gray(`${current} of ${total}`)

  return `${EOL}${countByStatusCode}${EOL}${EOL}${timestamp} ${spinnerFrame}${progress} ${url}`
}

const renderResume = ({ startTimestamp, count, links }) => {
  const info = map(sortByStatusCode(count), (count, statusCode) => {
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
        const urls = concat(requestUrl, redirectUrls).join(' → ')
        return `${colorizeStatusCode} ${urls} ${colorizeTimestamp}`
      }
    ).join(EOL)

    return countByStatusCode + EOL + rows + EOL
  }).join(EOL)

  const total = reduce(count, (acc, count) => acc + count, 0)
  const timestamp = prettyMs(Date.now() - startTimestamp)

  return gray(`${EOL}${info}${EOL}${total} links in ${timestamp}`)
}

module.exports = state => {
  if (state.end) return renderResume(state)
  if (state.quiet) return ''
  return renderCount(state)
}

module.exports.count = renderCount
module.exports.resume = renderResume
