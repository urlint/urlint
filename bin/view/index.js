'use strict'

const path = require('path')

const componentPath = path.join(__dirname, './component.js')

const mount = require('./mount')

module.exports = props => mount(componentPath, props)
