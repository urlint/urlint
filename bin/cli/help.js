'use strict'

const chalk = require('chalk')
const theme = require('../view/theme')
const { description } = require('../../package.json')

const green = chalk.hex(theme.green)

module.exports = chalk.gray(`${chalk.gray(description)}

  Usage
    $ ${green('urlint')} url [<flags>]

  Options
    -w, --whitelist     Add an url to ignore
    -c, --concurrence   Adjust the number of concurrent petitions (defaults to 30)
    -v, --version       Output the version number

  Examples

  – Get all HTTP status from an URL
    $ ${green('urlint')} https://kikobeats.com

  – Exclude a particular URL
    $ ${green(
    'urlint'
  )} https://kikobeats.com --whitelist https://www.linkedin.com/in/kikobeats'
`)
