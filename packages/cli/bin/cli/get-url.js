'use strict'

module.exports = input => {
  const value = input || process.env.DEPLOY_URL || process.env.DEPLOY_PRIME_URL || process.env.URL
  return Array.isArray(value) ? value : value.split(',').map(item => item.trim())
}
