'use strict'

const { size, isNil } = require('lodash')
const neatLog = require('neat-log')

const render = require('./render')

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

module.exports = ({ emitter, quiet, ...opts }) => {
  const neat = neatLog(render, opts)

  neat.use((state, bus) => {
    state.quiet = quiet
    state.count = {}
    state.links = {}
    state.end = false

    setInterval(() => {
      bus.emit('render')
    }, 100)

    emitter.on('status', ({ statusCode, data }) => {
      const newState = setState(state, { statusCode, data })
      state.count = { ...state.count, ...newState.count }
      state.links = { ...state.links, ...newState.links }
    })

    emitter.on('fetching', ({ url }) => {
      state.fetchingUrl = url
    })

    emitter.on('end', data => {
      state.end = true
      bus.clear()
      neat.render()
      const exitCode = size(data) > 1 ? 1 : 0
      process.exit(exitCode)
    })
  })
}
