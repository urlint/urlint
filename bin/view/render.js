'use strict'

const { toNumber, first, chain, map, reduce } = require('lodash')
const os = require('os')

const spinner = require('ora')({
  text: '',
  color: 'blue'
})

const { colorizeStatus, colorizeLine } = require('./helpers')

const resumeCount = (count, statusCode) =>
  colorizeStatus(statusCode, `${statusCode} ${count}`)

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
  const { count, fetchingUrl = '' } = state

  const resume = map(count, resumeCount).join(os.EOL)
  const footer = fetchingUrl
    ? `${os.EOL}${os.EOL}${spinner.frame()}${colorizeLine(fetchingUrl)}`
    : ''
  return `${resume}${footer}`
}

const renderResume = ({ count, links }) => {
  const info = map(sortByStatusCode(count), (count, statusCode) => {
    const statusHeader = resumeCount(count, statusCode)
    const rows = map(
      links[statusCode],
      ([statusCode, url]) => `${colorizeStatus(statusCode)} ${url}`
    ).join(os.EOL)
    return statusHeader + os.EOL + rows + os.EOL
  }).join(os.EOL)

  const total = reduce(count, (acc, count) => acc + count, 0)

  return colorizeLine(`${info}${os.EOL}Total ${total}`)
}

module.exports = state =>
  state.end === false ? renderCount(state) : renderResume(state)
module.exports.renderCount = renderCount
module.exports.resume = renderResume
