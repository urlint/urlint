'use strict'

const neatLog = require('neat-log')

const { processExit, setState } = require('./helpers')
const render = require('./render')

module.exports = ({ emitter, quiet, ...opts }) => {
  if (quiet) {
    const state = { count: {}, links: {} }

    emitter.on('status', ({ statusCode, data }) => {
      const newState = setState(state, { statusCode, data })
      state.count = { ...state.count, ...newState.count }
      state.links = { ...state.links, ...newState.links }
    })

    emitter.on('end', data => {
      const output = render.links(state)
      console.log(output)
      processExit(data)
    })
  } else {
    const neat = neatLog(render, opts)

    neat.use((state, bus) => {
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
        processExit(data)
      })
    })
  }
}
