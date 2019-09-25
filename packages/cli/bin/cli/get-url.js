'use strict'

module.exports = input =>
  input || process.env.DEPLOY_URL || process.env.DEPLOY_PRIME_URL || process.env.URL
