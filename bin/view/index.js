'use strict'

const { isNil, includes, isEmpty, first, toNumber, chain } = require('lodash')
const neatLog = require('neat-log')

const { SUCCESS_STATUS_CODES } = require('./constant')
const build = require('../cli/build')
const render = require('./render')

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

const sortByStatusCode = data =>
  chain(data)
    .toPairs()
    .sortBy(pair => toNumber(first(pair).charAt(0)))
    .fromPairs()
    .value()

module.exports = ({ total, emitter, quiet, verbose, logspeed, ...opts }) => {
  const state = {
    quiet,
    verbose,
    total,
    current: 0,
    count: {},
    links: {},
    end: false,
    fetchingUrl: '',
    startTimestamp: Date.now(),
    timestamp: {},
    exitCode: null
  }

  const neat = neatLog(render, { ...opts, logspeed, state })

  neat.use((state, bus) => {
    emitter.on('status', data => {
      const newState = setState(state, data)
      state.count = sortByStatusCode({ ...state.count, ...newState.count })
      state.links = { ...state.links, ...newState.links }
    })

    emitter.on('fetching', data => {
      state.fetchingUrl = data.url
      ++state.current
    })

    emitter.on('end', data => {
      state.end = true

      const errorCodes = chain(data)
        .keys()
        .remove(statusCode => !includes(SUCCESS_STATUS_CODES, statusCode))
        .value()

      state.exitCode = isEmpty(errorCodes) ? 0 : 1
    })

    setInterval(async () => {
      bus.emit('render')
      if (!isNil(state.exitCode)) {
        await build.exit({ buildCode: state.exitCode })
      }
    }, logspeed)
  })
}
