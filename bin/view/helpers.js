'use strict'

const { isEqual, includes, keys, size, isNil } = require('lodash')

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
  process.exit(isOnly2xx ? 0 : 1)
}

module.exports = {
  setState,
  processExit
}
