'use strict'

const { green, gray } = require('../view/colorize')
const { description } = require('../../package.json')

module.exports = gray(`${gray(description)}

  Usage
    $ ${green('urlint')} <url> [<flags>]

  Flags
    -c, --concurrence     Number of concurrent petitions (defaults to 30)
    -f, --followRedirect  Redirect responses should be followed (defaults to true)
    -h, --help            Show the help information
    -q, --quiet           Show only the resume (defaults to false)
    -r, --retries         Number of request retries when network errors happens (defaults to 2)
    -t, --timeout         Milliseconds to wait before consider a timeout response
    -v, --version         Output the version number
    -w, --whitelist       Add one or multiple url pattern to ignore

  Examples

  – Get all HTTP status from an URL
    $ ${green('urlint')} https://kikobeats.com

  – Exclude a particular URL
    $ ${green(
    'urlint'
  )} https://kikobeats.com --whitelist https://www.linkedin.com/in/kikobeats'`)
