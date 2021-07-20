'use strict'

const { green, gray } = require('../view/colorize')
const { name, description } = require('../../package.json')

module.exports = gray(`${gray(description)}

  Usage
    $ ${green(name)} <url> [<flags>]

  Flags
    -c, --concurrence     Number of concurrent petitions (defaults to 8)
    -f, --followRedirect  Redirect responses should be followed (defaults to true)
    -h, --help            Show the help information
    -q, --quiet           Show only the resume (defaults to false)
    -r, --retries         Number of request retries when network errors happens (defaults to 2)
    -s, --selector        Only detects URLs inside the selector
    -t, --timeout         Milliseconds to wait before consider a timeout response
    -p, --prerender       Enable or disable prerendering for getting HTML markup (defaults to auto)
    -v, --verbose         Enable verbose output (defaults to false)
    -w, --whitelist       Add one or multiple url pattern to ignore

  Examples

  – Get all HTTP status from an URL
    $ ${green(name)} https://kikobeats.com

  – Exclude a particular URL
    $ ${green(name)} https://kikobeats.com --whitelist https://www.linkedin.com/in/kikobeats

  – Exclude based in a matcher
    $ ${green(name)} https://kikobeats.com --whitelist "https://github.com*

  – Just detect URLs inside body selector
    $ ${green(name)} https://kikobeats.com --selector body`)
