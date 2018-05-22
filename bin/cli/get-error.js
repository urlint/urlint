'use strict'

const { chain } = require('lodash')

module.exports = genericError =>
  chain(genericError)
    .castArray()
    .first()
    .value()
