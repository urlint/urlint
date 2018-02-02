'use strict'

const chalk = require('chalk')
const { isEqual, includes, keys, size, mapValues, isNil } = require('lodash')

const theme = require('./theme')

const STATUS_CODE_COLOR = {
  '2': 'green',
  '3': 'blue',
  '4': 'yellow',
  '5': 'red',
  '9': 'red'
}

const statusCodeColors = mapValues(theme, hex => chalk.hex(hex))

const STATUS_CODE_COLOR_FALLBACK = 'magenta'

const getStatusCodeId = statusCode => statusCode.toString().charAt(0)

const getStatusCodeColor = statusCode => {
  const id = getStatusCodeId(statusCode)
  return STATUS_CODE_COLOR[id] || STATUS_CODE_COLOR_FALLBACK
}

const colorizeStatus = (statusCode, str = statusCode) => {
  const color = getStatusCodeColor(statusCode)
  const statusCodeColor = statusCodeColors[color]
  return statusCodeColor(str)
}

const colorizeLine = chalk.gray

const setState = (state, { statusCode, data }) => {
  const status = state.count[statusCode]
  const linkStatus = state.links[statusCode]
  const linkItem = [data.statusCode, data.url]

  const count = { [statusCode]: isNil(status) ? 1 : status + 1 }
  const links = {
    [statusCode]: isNil(linkStatus) ? [linkItem] : linkStatus.concat([linkItem])
  }

  return { count, links }
}

const processExit = data => {
  const statusCodes = keys(data)
  const isOnly2xx =
    includes(statusCodes, '2xx') && isEqual(size(statusCodes), 1)
  const exitCode = isOnly2xx ? 0 : 1
  process.exit(exitCode)
}

module.exports = {
  colorizeStatus,
  colorizeLine,
  setState,
  processExit
}
