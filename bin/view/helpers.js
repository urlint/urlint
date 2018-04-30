'use strict'

const { isEqual, includes, keys, size, isNil } = require('lodash')

const setState = (state, data) => {
  const { statusCodeGroup } = data

  const status = state.count[statusCodeGroup]
  const linkStatus = state.links[statusCodeGroup]
  const linkItem = [data.statusCode, data.url, data.timestamp]
  const count = { [statusCodeGroup]: isNil(status) ? 1 : status + 1 }
  const links = {
    [statusCodeGroup]: isNil(linkStatus)
      ? [linkItem]
      : linkStatus.concat([linkItem])
  }

  return { count, links }
}

const processExit = data => {
  const statusCodes = keys(data)
  const isOnly2xx =
    includes(statusCodes, '2xx') && isEqual(size(statusCodes), 1)
  process.exit(isOnly2xx ? 0 : 1)
}

module.exports = {
  setState,
  processExit
}
