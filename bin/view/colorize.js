'use strict'

const { mapValues } = require('lodash')

const chalk = require('chalk')

const THEME = {
  red: '#ff5c57',
  green: '#5af78e',
  yellow: '#f3f99d',
  blue: '#57c7ff',
  magenta: '#ff6ac1',
  cyan: '#9aedfe'
}

const STATUS_CODE_COLOR = {
  '2': 'green',
  '3': 'blue',
  '4': 'yellow',
  '5': 'red',
  '9': 'red'
}

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
