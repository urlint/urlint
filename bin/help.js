'use strict'

const chalk = require('chalk')
const theme = require('./theme')
const { description } = require('../package.json')

const green = chalk.hex(theme.green)

module.exports = chalk.gray(`${chalk.gray(description)}

  Usage
    $ ${green('urlint')} url [<flags>]

  Options
    -i, --ignore        Add an url to ignore
    -v, --version       Output the version number

  Examples

  – Get all HTTP status from an URL
    $ ${green('eslint')} https://kikobeats.com

  – Exclude a particular URL
    $ ${green(
    'eslint'
  )} https://kikobeats.com --ignore https://www.linkedin.com/in/kikobeats'
`)
