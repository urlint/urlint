'use strict'

const { getUrl, isUrl } = require('@metascraper/helpers')
const normalizeUrl = require('normalize-url')
const getUrlsFromHtml = require('html-urls')
const { map, reduce } = require('lodash')
const fromXML = require('xml-urls')
const got = require('got')

const { isXmlUrl } = fromXML

const fromHTML = async (url, opts) => {
  const { body: html } = await got(url, opts)
  const urls = await getUrlsFromHtml({ url, html, ...opts })
  return map(urls, 'normalizeUrl')
}

module.exports = async (url, opts) => {
  const urls = isXmlUrl(url)
    ? await fromXML(url, opts)
    : await fromHTML(url, opts)

  return reduce(
    urls,
    (acc, relativeUrl) => {
      const absoluteUrl = normalizeUrl(getUrl(url, relativeUrl))
      if (isUrl(absoluteUrl, { relative: false })) acc.push(absoluteUrl)
      return acc
    },
    []
  )
}
