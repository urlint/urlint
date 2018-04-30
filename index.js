'use strict'

const getStatusCode = require('url-code-status')
const timeSpan = require('time-span')
const aigle = require('aigle')
const mitt = require('mitt')

const getStatusByGroup = statusCode => `${String(statusCode).charAt(0)}xx`

module.exports = async (urls, { concurrence = 8, ...opts } = {}) => {
  const emitter = mitt()

  async function iterator (acc, url) {
    emitter.emit('fetching', { url })

    const end = timeSpan()
    const statusCode = await getStatusCode(url, opts)
    const timestamp = end()
    const statusCodeGroup = getStatusByGroup(statusCode)
    const data = { statusCodeGroup, statusCode, url, timestamp }

    emitter.emit('status', data)

    if (!acc[statusCodeGroup]) acc[statusCodeGroup] = [data]
    else acc[statusCodeGroup].push(data)
  }

  aigle
    .transformLimit(urls, concurrence, iterator, {})
    .then(data => emitter.emit('end', data))

  return emitter
}
