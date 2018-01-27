'use strict'

const { STATUS_COLORS, STATUS_COLORS_FALLBACK } = require('./constants')

const getStatusColor = status =>
  STATUS_COLORS[status.toString().charAt(0)] || STATUS_COLORS_FALLBACK

module.exports = { getStatusColor }
