'use strict'

const { toNumber, first, chain, map, reduce } = require('lodash')
const prettyMs = require('pretty-ms')
const { EOL } = require('os')

const spinner = require('ora')({ text: '', color: 'gray' })
const { green, blue, gray, byStatusCode } = require('./colorize')

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
  const progress = gray(`${current}/${total}`)

  return `${countByStatusCode}${EOL}${EOL}${timestamp} ${spinnerFrame}${progress} ${url}`
}

const renderResume = ({ count, links }) => {
  const info = map(sortByStatusCode(count), (count, statusCode) => {
    const countByStatusCode = resumeCount(count, statusCode)
    const rows = map(
      links[statusCode],
      ([statusCode, url]) => `${byStatusCode(statusCode)} ${url}`
    ).join(EOL)
    return countByStatusCode + EOL + rows + EOL
  }).join(EOL)

  const total = reduce(count, (acc, count) => acc + count, 0)

  return gray(`${info}${EOL}Total ${total}`)
}

module.exports = state =>
  state.end === false ? renderCount(state) : renderResume(state)
module.exports.count = renderCount
module.exports.resume = renderResume
