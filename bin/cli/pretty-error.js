'use strict'

const PrettyError = require('pretty-error')
const cleanStack = require('clean-stack')
const { chain } = require('lodash')

const pe = new PrettyError()

pe.appendStyle({
  // this is a simple selector to the element that says 'Error'
  'pretty-error > header > title > kind': {
    background: 'none',
    color: 'bright-red',
    marginRight: 1
  },

  'pretty-error > header > colon': {
    display: 'none'
  },

  'pretty-error > header > message': {
    color: 'grey'
  },

  'pretty-error > trace > item > header > pointer > file': {
    color: 'grey'
  },

  'pretty-error > trace > item > header > pointer > colon': {
    color: 'grey'
  },

  'pretty-error > trace > item > header > pointer > line': {
    color: 'grey'
  },

  'pretty-error > trace > item > header > what': {
    color: 'grey'
  }
})

const renderError = error => {
  const stack = cleanStack(error.stack)
  const cleanError = Object.assign({}, error, { stack })
  return pe.render(cleanError)
}

module.exports = genericError => {
  const error = chain(genericError)
    .castArray()
    .first()
    .value()
  return renderError(error)
}
