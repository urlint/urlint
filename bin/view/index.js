'use strict'

const neatLog = require('neat-log')

const { processExit, setState } = require('./helpers')
const render = require('./render')

module.exports = ({ total, emitter, quiet, logspeed, ...opts }) => {
  const state = {
    quiet,
    total,
    current: 0,
    count: {},
    links: {},
    end: false,
    fetchingUrl: '',
    startTimestamp: Date.now(),
    timestamp: {}
  }

  const neat = neatLog(render, { ...opts, logspeed, state })

  neat.use((state, bus) => {
    emitter.on('status', data => {
      const newState = setState(state, data)
      state.count = { ...state.count, ...newState.count }
      state.links = { ...state.links, ...newState.links }
    })

    emitter.on('fetching', ({ url }) => {
      state.fetchingUrl = url
      ++state.current
    })

    emitter.on('end', data => {
      state.end = true
      neat.render()
      processExit(data)
    })

    setInterval(() => bus.emit('render'), logspeed)
  })
}
