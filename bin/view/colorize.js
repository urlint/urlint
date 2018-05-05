'use strict'

const { mapValues } = require('lodash')

const chalk = require('chalk')

const { THEME, STATUS_CODE_COLOR } = require('./constant')

const statusCodeColors = mapValues(THEME, hex => chalk.hex(hex))

const STATUS_CODE_COLOR_FALLBACK = 'magenta'

const getStatusCodeId = statusCode => statusCode.toString().charAt(0)

const getStatusCodeColor = statusCode => {
  const id = getStatusCodeId(statusCode)
  return STATUS_CODE_COLOR[id] || STATUS_CODE_COLOR_FALLBACK
}

const byStatusCode = (statusCode, str = statusCode) => {
  const color = getStatusCodeColor(statusCode)
  const statusCodeColor = statusCodeColors[color]
  return statusCodeColor(str)
}

const getRequestColor = timestamp => {
  if (timestamp < 500) return 'green'
  if (timestamp < 1200) return 'yellow'
  return 'red'
}

module.exports = {
  ...statusCodeColors,
  gray: chalk.gray,
  byStatusCode,
  getRequestColor,
  theme: THEME
}
