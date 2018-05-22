'use strict'

const Build = require('github-build')

const { repo, sha } = require('ci-env')

const label = 'urlint'
const description = 'Checking URLs availability...'

const token =
  process.env.github_token ||
  process.env.GITHUB_TOKEN ||
  process.env.bundlesize_github_token ||
  process.env.BUNDLESIZE_GITHUB_TOKEN

const meta = { repo, sha, token, label, description }

const noopBuild = {
  start: () => {},
  pass: () => {},
  fail: () => {},
  error: () => {}
}

module.exports = () => (!token ? noopBuild : new Build(meta))
