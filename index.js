'use strict'

const getStatusCode = require('url-code-status')
const aigle = require('aigle')
const mitt = require('mitt')

const getStatus = statusCode => `${String(statusCode).charAt(0)}xx`

module.exports = async (urls, {concurrent = 30} = {}) => {
  const emitter = mitt()

  const iterator = async (acc, url) => {
    const statusCode = await getStatusCode(url)
    const status = getStatus(statusCode)
    const data = { statusCode, url }

    if (!acc[status]) acc[status] = [data]
    else acc[status].push(data)

    emitter.emit(status, data)
  }

  aigle
    .transformLimit(urls, concurrent, iterator, {})
    .then(data => emitter.emit('end', data))

  return emitter
}
