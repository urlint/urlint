'use strict'

const importJsx = require('import-jsx')
const { h, render } = require('ink')

module.exports = (component, props) => render(h(importJsx(component), props))
