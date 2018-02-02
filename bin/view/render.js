'use strict'

const { map, reduce } = require('lodash')
const os = require('os')

const spinner = require('ora')({
  text: '',
  color: 'blue'
})

const { colorizeStatus, colorizeLine } = require('./helpers')

const resumeCount = (count, statusCode) => {
  return colorizeStatus(statusCode, `${statusCode} ${count}`)
}

const count = state => {
  const { quiet, count, fetchingUrl = '' } = state
  if (quiet) return ''

  const resume = map(count, resumeCount).join(os.EOL)
  const footer = fetchingUrl
    ? `${os.EOL}${os.EOL}${spinner.frame()}${colorizeLine(fetchingUrl)}`
    : ''
  return `${resume}${footer}`
}

const links = ({ count, links }) => {
  const total = reduce(count, (acc, count) => acc + count, 0)

  const resume = map(count, (count, statusCode) => {
    const header = resumeCount(count, statusCode)
    const rows = map(
      links[statusCode],
      ([statusCode, url]) => `${colorizeStatus(statusCode)} ${url}`
    ).join(os.EOL)

    return header + os.EOL + rows + os.EOL
  }).join(os.EOL)

  return colorizeLine(`${resume}${os.EOL}Total ${total}`)
}

module.exports = state => (state.end === false ? count(state) : links(state))
module.exports.count = count
module.exports.links = links
