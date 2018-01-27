'use strict'

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "h" }] */

const { h, Indent, Component, Text } = require('ink')
const { reduce, map } = require('lodash')
const chalk = require('chalk')
const os = require('os')

const { getStatusColor } = require('./helpers')

module.exports = class Counter extends Component {
  constructor (props) {
    super(props)

    this.state = {
      count: {},
      links: {}
    }

    const { emitter } = props

    emitter.on('*', (eventName, data) => {
      if (eventName !== 'end') this.addStatusCode(eventName, data)
      else this.setState({ end: true })
    })
  }

  addStatusCode (statusCode, payload) {
    const status = this.state.count[statusCode]
    const links = this.state.links[statusCode]
    const linkItem = [payload.statusCode, payload.normalizeUrl]

    let nextCount
    let nextLinks

    if (status === undefined) {
      nextCount = { [statusCode]: 1 }
    } else {
      nextCount = { [statusCode]: status + 1 }
    }

    if (links === undefined) {
      nextLinks = { [statusCode]: [linkItem] }
    } else {
      nextLinks = { [statusCode]: links.concat([linkItem]) }
    }

    this.setState({
      count: { ...this.state.count, ...nextCount },
      links: { ...this.state.links, ...nextLinks }
    })
  }

  printStatusCode (statusCode, count) {
    return (
      <Indent size={1}>
        <Text hex={getStatusColor(statusCode)}>
          · {statusCode} {count}
        </Text>
      </Indent>
    )
  }

  printUrl (statusCode, url) {
    const prettyStatusCode = chalk.hex(getStatusColor(statusCode))(statusCode)
    const prettyUrl = chalk.gray(url)
    return `   ${prettyStatusCode} ${prettyUrl}`
  }

  renderStatusCode (status) {
    return map(status, (count, stat) => (
      <div>{this.printStatusCode(stat, count)}</div>
    ))
  }

  renderLinks (status, links) {
    const total = reduce(status, (acc, count) => acc + count, 0)

    const details = map(status, (count, stat) => {
      const urls = map(links[stat], ([statusCode, url]) =>
        this.printUrl(statusCode, url)
      ).join(os.EOL)

      return (
        <span>
          <div>{this.printStatusCode(stat, count)}</div>
          <div>
            {urls}
            <div />
          </div>
        </span>
      )
    })

    return (
      <span>
        <div>{details}</div>
        <span>
          <Indent size={3}>{chalk.gray(`Total ${total}`)}</Indent>
        </span>
      </span>
    )
  }

  render () {
    return (
      <span>
        {!this.state.end
          ? this.renderStatusCode(this.state.count)
          : this.props.minimal
            ? this.renderStatusCode(this.state.count)
            : this.renderLinks(this.state.count, this.state.links)}
      </span>
    )
  }
}
