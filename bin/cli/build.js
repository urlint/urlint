'use strict'

const Build = require('github-build')

const { buildUrl, repo, sha } = require('ci-env')

const MESSAGE = {
  START: 'Checking URLs availability…',
  PASS: 'Yours links are fine',
  FAIL: 'Something is wrong in your links',
  ERROR: 'Uh, something unexpected happened'
}

const EXIT_CODE_METHOD_MAPPER = {
  0: 'pass',
  1: 'fail'
}

const token =
  process.env.github_token ||
  process.env.GITHUB_TOKEN ||
  process.env.urlint_github_token ||
  process.env.URLINT_GITHUB_TOKEN

const meta = {
  repo,
  sha,
  token,
  label: 'urlint',
  description: MESSAGE.START,
  url: buildUrl
}

const noopBuild = {
  start: () => Promise.resolve(),
  pass: () => Promise.resolve(),
  fail: () => Promise.resolve(),
  error: () => Promise.resolve()
}

const handleError = err => {
  const message = `Could not add github status.${err.status}: ${
    err.error.message
  }`
  console.error(message)
}

const createBuild = build => ({
  pass: () => build.pass(MESSAGE.PASS).catch(handleError),
  fail: () => build.fail(MESSAGE.FAIL).catch(handleError),
  error: () => build.error(MESSAGE.ERROR).catch(handleError),
  start: () => build.start(MESSAGE.START).catch(handleError)
})

const createExit = build => async ({ buildCode = 0, exitCode = buildCode }) => {
  const method = EXIT_CODE_METHOD_MAPPER[buildCode] || 'error'
  await build[method]()
  process.exit(exitCode)
}

const build = createBuild(token ? new Build(meta) : noopBuild)
build.exit = createExit(build)

module.exports = build
