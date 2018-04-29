'use strict'

const getStatusCode = require('url-code-status')
const aigle = require('aigle')
const mitt = require('mitt')

const getStatus = statusCode => `${String(statusCode).charAt(0)}xx`

module.exports = async (urls, { concurrence = 8, ...opts } = {}) => {
  const emitter = mitt()

  async function iterator (acc, url) {
    const statusCode = await getStatusCode(url, opts)
    emitter.emit('fetching', { url })

    const status = getStatus(statusCode)
    const data = { statusCode, url }

    if (!acc[status]) acc[status] = [data]
    else acc[status].push(data)

    emitter.emit('status', { statusCode: status, data })
  }

  aigle
    .transformLimit(urls, concurrence, iterator, {})
    .then(data => emitter.emit('end', data))

  return emitter
}
