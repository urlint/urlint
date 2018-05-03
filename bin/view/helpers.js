'use strict'

const { includes, chain, isEmpty, isNil } = require('lodash')

const VALID_STATUS_CODES = ['2xx', '3xx']

const setState = (state, data) => {
  const { statusCodeGroup } = data

  const status = state.count[statusCodeGroup]
  const linkStatus = state.links[statusCodeGroup]

  const count = { [statusCodeGroup]: isNil(status) ? 1 : status + 1 }
  const links = {
    [statusCodeGroup]: isNil(linkStatus) ? [data] : linkStatus.concat(data)
  }

  return { count, links }
}

const processExit = data => {
  const statusCodes = chain(data)
    .keys()
    .remove(statusCode => !includes(VALID_STATUS_CODES, statusCode))
    .value()

  process.exit(isEmpty(statusCodes) ? 0 : 1)
}

module.exports = {
  setState,
  processExit
}
